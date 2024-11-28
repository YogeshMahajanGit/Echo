import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
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

export { newGroupChat, getMyChatMessage, getMyGroups, addMemberGroup };
