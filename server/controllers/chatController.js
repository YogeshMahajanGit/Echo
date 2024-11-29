import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// New Group
async function newGroupChat(req, res, next) {
  const { name, members } = req.body;

  // Validate
  try {
    if (members.length < 2) {
      return next(new ErrorHandler("Group must have at least 3 members", 400));
    }

    const allMembers = [...members, req.user];

    // Create a new group chat
    try {
      await Chat.create({
        name,
        groupChat: true,
        creator: req.user,
        members: allMembers,
      });
    } catch (err) {
      return next(new ErrorHandler("Failed to create group chat", 500));
    }

    try {
      // Emit related events
      emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
      emitEvent(req, REFETCH_CHATS, members);
    } catch (err) {
      return next(new ErrorHandler("Failed to emit events for the group", 500));
    }

    return res.status(201).json({
      success: true,
      message: "Group Created",
    });
  } catch (err) {
    next(new ErrorHandler("An error occurred while creating the group", 500));
  }
}

// Get user chat
async function getMyChatMessage(req, res, next) {
  // Fetch user chats
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  if (!chats) {
    return next(new ErrorHandler("Not Chat found", 404));
  }

  // Transform chats
  try {
    const transformedChat = chats.map(({ _id, name, members, groupChat }) => {
      const otherMember = getOtherMember(members, req.user);

      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember.avatar.url],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,
      chats: transformedChat,
    });
  } catch (err) {
    return next(new ErrorHandler("Error while chat data", 500));
  }
}

// Get groups
async function getMyGroups(req, res, next) {
  // Fetch groups
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  if (!chats) {
    return next(new ErrorHandler("You dont have any group", 404));
  }

  // Transform group data and add avatar
  try {
    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

    return res.status(200).json({
      success: true,
      groups,
    });
  } catch (err) {
    return next(new ErrorHandler("Error while find group ", 500));
  }
}

// add new members
async function addMemberGroup(req, res, next) {
  const { chatId, members } = req.body;

  if (!chatId || !members || members.length < 1) {
    return next(new ErrorHandler("Add member to group", 400));
  }

  try {
    // Find the chat
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.groupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    try {
      // Find all new members
      const allNewMembersPromises = members.map((id) =>
        User.findById(id, "name")
      );
      const allMembers = await Promise.all(allNewMembersPromises);

      // Filter unique members who are not already in the group
      const uniqueMembers = allMembers
        .filter((member) => !chat.members.includes(member._id.toString()))
        .map((member) => member._id);

      chat.members.push(...uniqueMembers);

      // Group size limit
      if (chat.members.length > 20) {
        return next(new ErrorHandler("Group members limit reached", 400));
      }

      await chat.save();

      // Emit events
      emitEvent(
        req,
        ALERT,
        chat.members,
        `You have been added to ${chat.name} by ${req.user.name}`
      );
      emitEvent(req, REFETCH_CHATS, chat.members);

      return res.status(200).json({
        success: true,
        message: "Members added successfully",
      });
    } catch (err) {
      return next(new ErrorHandler("Error while adding members to group", 500));
    }
  } catch (err) {
    return next(new ErrorHandler("Error while fetching the chat", 500));
  }
}

// remove members
async function removeMemberGroup(req, res, next) {
  const { userId, chatId } = req.body;

  try {
    // Validate
    if (!userId || !chatId) {
      return next(new ErrorHandler("User ID and Chat ID are required", 400));
    }

    const [chat, removedMember] = await Promise.all([
      Chat.findById(chatId),
      User.findById(userId, "name"),
    ]);

    // Check if chat exists
    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }
    //is gruop chat
    if (!chat.groupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
      return next(new ErrorHandler("You not allowed remove members ", 400));
    }

    if (chat.members.length <= 3) {
      return next(new ErrorHandler("Group must have at least 3 members", 400));
    }

    // Remove the member
    chat.members = chat.members.filter(
      (member) => member.toString() !== req.user.toString()
    );

    // save changes
    await chat.save();

    emitEvent(
      req,
      ALERT,
      chat.members,
      `${removedMember.name} has been removed`
    );

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    next(error);
  }
}

// leave a group
async function leaveGroup(req, res, next) {
  const chatId = req.params.id;

  //find chat
  const chat = await Chat.findById(chatId);

  if (!chat) {
    return next(new ErrorHandler("Chat not found"));
  }

  if (!chat.groupChat) {
    return next(new ErrorHandler("This group does not exist", 400));
  }

  const remainingUsers = chat.members.filter(
    (user) => user.toString() !== req.user.toString()
  );

  //if admin leave group
  if (chat.creator.toString() === req.user.toString()) {
    const newCreator = remainingUsers[0];

    //new creator
    chat.creator = newCreator;
  }

  chat.members = remainingUsers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `user ${user.name} has left group`);

  return res.status(200).json({
    success: true,
    message: "You Left group",
  });
}

//send Image/Video/files
async function sendAttachments(req, res, next) {
  const { chatId } = req.body;

  // database call
  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please provide a file", 400));

  //Upload files
  const attachments = [];

  const messageForDB = {
    content: "",
    attachments,
    sender: user._id,
    chat: chatId,
  };

  const messageForRealTime = {
    ...messageForDB,
    sender: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar.url,
    },
  };

  // create message
  const message = await Message.create(messageForDB);

  // Events
  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRealTime,
    chatId,
  });
  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  return res.status(200).json({
    success: true,
    message,
  });
}

// Chat Details
async function getChatDetails(req, res, next) {
  // find chat details
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    // send chat message
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    return res.status(200).json({
      success: true,
      chat,
    });
  }
}

// Rename Group
async function reNameGroup(req, res, next) {
  const chatId = req.params.id;
  const { name } = req.body;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat) {
      return next(new ErrorHandler("This is not a group chat", 400));
    }

    // Only creator can rename the group
    if (req.user) {
      if (chat.creator.toString() !== req.user?.toString()) {
        return next(
          new ErrorHandler("You are not allowed to rename this group", 400)
        );
      }
    }

    // Update the group name
    chat.name = name;

    // Save chat
    try {
      await chat.save();
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }

    // Emit events
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Group name has been updated",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

async function handleDeleteChat(req, res, next) {
  const chatId = req.params.id;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    const members = chat.members;

    if (!chat.groupChat && chat.creator.toString() !== req.user.toString()) {
      return next(
        new ErrorHandler("You are not allowed to delete this group", 400)
      );
    }

    if (!chat.groupChat && chat.members.includes(req.user.toString())) {
      return next(
        new ErrorHandler("You are not allowed to delete this group", 403)
      );
    }

    // Delete chat and chat attachments
    try {
      const public_ids = [];

      const messageAttachments = await Message.find({
        chat: chatId,
        attachments: { $exists: true, $ne: [] },
      });

      messageAttachments.forEach(({ attachments }) =>
        attachments.forEach(({ public_id }) => public_ids.push(public_id))
      );

      // delete cloudinary files
      await Promise.all([
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
      ]);
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }

    // Emit events
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

export {
  newGroupChat,
  getMyChatMessage,
  getMyGroups,
  addMemberGroup,
  removeMemberGroup,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  reNameGroup,
  handleDeleteChat,
};
