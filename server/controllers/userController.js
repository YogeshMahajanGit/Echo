import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { Request } from "../models/requestModel.js";
import {
  emitEvent,
  sendWebToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// create a new user / register
async function handleNewUser(req, res, next) {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  // Validation
  if (!name || !username || !password) {
    return next(new ErrorHandler("All fields are required"));
  }

  if (!file) return next(new ErrorHandler("Please Select Profile"));

  // check if user exists
  let userName = username;

  try {
    userName = await User.findOne({ name });

    if (userName) {
      return next(
        new ErrorHandler("User already exists with this email or username")
      );
    }
  } catch (err) {
    return next(new ErrorHandler("Error while checking existing user", 400));
  }

  //upload avatar image on cloudinary

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  let user;

  // Creating a new user
  try {
    user = await User.create({
      name,
      bio,
      username,
      password,
      avatar,
    });
  } catch (err) {
    return next(new ErrorHandler("Error while creating user"));
  }

  // Send token
  try {
    sendWebToken(res, user, 201, "User created");
  } catch (err) {
    next(new ErrorHandler("Something went wrong during registration"));
  }
}

//User Login
async function handleLogin(req, res, next) {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return next(new ErrorHandler("All fields required"));
  }

  let user;
  try {
    // Database call
    user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
  } catch (error) {
    return next(new ErrorHandler("Error fetching user from database"));
  }

  let isMatch;

  try {
    // Password comparison
    isMatch = await compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Password incorrect!", 401));
    }
  } catch (error) {
    return next(new ErrorHandler("Error during password comparison"));
  }

  // Send token
  try {
    sendWebToken(res, user, 200, `Welcome back, ${user.name}`);
  } catch (error) {
    next(new ErrorHandler("Something went wrong during handleLogin"));
  }
}

//User Logout
async function handleLogout(req, res, next) {
  return res
    .status(200)
    .cookie("echo-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
}

async function handleGetMyProfile(req, res, next) {
  try {
    const id = req.user;
    const user = await User.findById(id);

    if (!user) {
      next(new ErrorHandler("User not found"));
    }

    res.json({ success: true, user });
  } catch (error) {
    next(new ErrorHandler("Something Wrong ~"));
  }
}

//search user
async function handleSearchUser(req, res, next) {
  const { name = "" } = req.query;

  try {
    //my chats
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    const allUsers = myChats.flatMap((chat) => chat.members);

    // find all users
    const newUserExceptMe = await User.find({
      _id: { $nin: allUsers },
      name: { $regex: name, $options: "i" },
    });

    const users = newUserExceptMe.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(new ErrorHandler("Something Wrong ~"));
  }
}

async function handleFriendRequest(req, res, next) {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent"));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Request sent",
  });
}

async function handleAcceptFriendRequest(req, res, next) {
  const { requestId, accept } = req.body;

  if (!requestId) {
    return next(new ErrorHandler("Invalid request", 500));
  }

  //find req and handle
  try {
    const request = await Request.findById(requestId)
      .populate("sender", "name")
      .populate("receiver", "name");

    if (!request) {
      return next(new ErrorHandler("Invalid request", 400));
    }

    // check request
    if (request.receiver._id.toString() !== req.user.toString()) {
      return next(new ErrorHandler("Can't accept request", 400));
    }

    // remove request if not accept
    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Request rejected",
      });
    }

    //create chat & notify the members
    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name} - ${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    //send response
    return res.status(200).json({
      success: true,
      message: "Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    return next(new Error(error.message + `Something went wrong ~`));
  }
}

async function handleUserNotifications(req, res, next) {
  try {
    // find all notifications
    const request = await Request.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );

    // transform data
    const allNotifications = request.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    // send response

    return res.status(200).json({
      success: true,
      allNotifications,
    });
  } catch (error) {
    return next(new Error(`Something went wrong ~` + error.message));
  }
}

async function handleGetMyFriends(req, res, next) {
  const chatId = req.query.chatId;

  try {
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");

    // Transform chats into a list of friends
    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.user);
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    });

    // Filter out friends already in the chat
    if (chatId) {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
      }

      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id.toString())
      );

      return res.status(200).json({
        success: true,
        friends: availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  } catch (error) {
    return next(
      new ErrorHandler("Something went wrong: " + error.message, 500)
    );
  }
}

export {
  handleLogin,
  handleNewUser,
  handleLogout,
  handleGetMyProfile,
  handleSearchUser,
  handleFriendRequest,
  handleAcceptFriendRequest,
  handleUserNotifications,
  handleGetMyFriends,
};
