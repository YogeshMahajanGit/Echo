import { Chat } from '../models/chatModel.js';
import { Message } from '../models/messageModel.js';
import { User } from '../models/userModel.js';
import { ErrorHandler } from '../utils/utility.js';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../utils/features.js';
import { adminSecretKey } from '../server.js';

async function handleAdminLogin(req, res, next) {
  const { secretKey } = req.body;

  try {
    const isMatch = secretKey === adminSecretKey;

    if (!isMatch) {
      return next(new ErrorHandler('Access denied!', 401));
    }

    // get token
    const token = jwt.sign(secretKey, process.env.JWT_SECRET);

    // set token in cookies
    return res
      .status(200)
      .cookie('echo-admin-token', token, {
        ...cookieOptions,
        maxAge: 1000 * 60 * 30,
      })
      .json({
        success: true,
        message: 'Authentication successful',
      });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function handleAdminLogout(req, res, next) {
  return res
    .status(200)
    .cookie('echo-admin-token', '', {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: 'Logout successful',
    });
}

async function handleGetAdminData(req, res, next) {
  return res.status(200).json({
    admin: true,
  });
}

async function handleGetAllUsers(req, res, next) {
  try {
    // find users
    const users = await User.find({});

    const transformedUsers = await Promise.all(
      users.map(async ({ name, username, avatar, _id }) => {
        // find groups and friends
        const [groups, friends] = await Promise.all([
          Chat.countDocuments({ groupChat: true, members: _id }),
          Chat.countDocuments({ groupChat: false, members: _id }),
        ]);

        //return all data
        return { _id, name, username, avatar: avatar.url, groups, friends };
      })
    );

    return res.status(200).json({
      success: true,
      users: transformedUsers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function handleGetAllChats(req, res, next) {
  try {
    const chats = await Chat.find({})
      .populate('members', 'name avatar')
      .populate('creator', 'name avatar');

    const transformedChats = await Promise.all(
      chats.map(async ({ members, _id, groupChat, name, creator }) => {
        //find messages and other info
        const totalMessages = await Message.countDocuments({ chat: _id });

        return {
          _id,
          groupChat,
          name,
          avatar: members.slice(0, 3).map((members) => members.avatar.url),
          members: members.map(({ _id, name, avatar }) => ({
            _id,
            name,
            avatar: avatar.url,
          })),
          creator: {
            name: creator?.name || 'None',
            avatar: creator?.avatar.url || '',
          },
          totalMembers: members.length,
          totalMessages,
        };
      })
    );

    return res.status(200).json({
      success: true,
      chats: transformedChats,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function handleGetAllMessages(req, res, next) {
  try {
    // find all messages
    const messages = await Message.find({})
      .populate('sender', 'name avatar')
      .populate('chat', 'groupChat');

    const transformedMessages = messages.map(
      ({ _id, sender, createdAt, chat, content, attachment }) => ({
        _id,
        attachment,
        content,
        chat: chat._id,
        groupChat: chat.groupChat,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar.url,
        },
        createdAt,
      })
    );

    return res.status(200).json({
      success: true,
      messages: transformedMessages,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function handleGetDashboardStats(req, res, next) {
  try {
    const [groupsCount, usersCount, messagesCount, totalChatsCount] =
      await Promise.all([
        Chat.countDocuments({ groupChat: true }),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
      ]);

    const today = new Date();
    const lastSevenDays = new Date();
    lastSevenDays.setDate(lastSevenDays.getDate() - 7);

    // query for last 7 days
    const lastMessages = await Message.find({
      createdAt: {
        $gte: lastSevenDays,
        $lte: today,
      },
    }).select('createdAt');

    const messages = new Array(7).fill(0);
    const dayInMiliseconds = 1000 * 60 * 60 * 24;

    lastMessages.forEach((message) => {
      const index = Math.floor(
        (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds
      );

      messages[6 - index]++;
    });

    const stats = {
      groupsCount,
      usersCount,
      messagesCount,
      totalChatsCount,
      messageChart: messages,
    };

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

export {
  handleAdminLogin,
  handleAdminLogout,
  handleGetAdminData,
  handleGetAllUsers,
  handleGetAllChats,
  handleGetAllMessages,
  handleGetDashboardStats,
};
