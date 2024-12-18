import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/messageModel.js";
import { v2 as cloudinary } from "cloudinary";
import { corsOptions } from "./config/config.js";
import { socketAuthenticate } from "./middlewares/authenticate.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});
app.set("io", io);

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const urlDB = process.env.MONGO_URI;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const PORT = process.env.PORT || 3000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const userSocketIDs = new Map();
const onlineUsers = new Set();

//DB connection & cloudinary config
connectDB(urlDB);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/admin", adminRouter);

//testing
app.get("/", (req, res) => {
  res.send("Welcome Developer");
});

// socket middleware / connect-auth
io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticate(err, socket, next)
  );
});

//New client socket connection
io.on("connection", (socket) => {
  // find user to connect
  const user = socket.user;

  // map id
  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    // msg send to client
    const sendRealMessage = {
      _id: uuid(),
      content: message,
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createAt: new Date().toISOString(),
    };

    // msg save in DB
    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    //emmit message
    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: sendRealMessage,
    });
    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    // create msg
    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    // get ID from members
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    // get ID from members
    const membersSockets = getSockets(members);

    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOINED, ({ userId, members }) => {
    const membersSocket = getSockets(members);

    onlineUsers.add(userId.toString());
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    const membersSocket = getSockets(members);

    onlineUsers.delete(userId.toString());
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());
    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

// Global error handler middleware
app.use(globalErrorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} Mode 🚀`);
});

export { adminSecretKey, envMode, userSocketIDs };
