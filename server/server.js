import express from "express";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import adminRouter from "./routes/adminRoutes.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/messageModel.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: "./.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {});

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

const urlDB = process.env.MONGO_URI;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const PORT = process.env.PORT || 3000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY;
const userSocketIDs = new Map();

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
io.use((socket, next) => {});

//New client socket connection
io.on("connection", (socket) => {
  const user = {
    _id: "dnd",
    name: "wakanda",
  };
  // map id
  userSocketIDs.set(user._id.toString(), socket.id);

  console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
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

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
    userSocketIDs.delete(user._id.toString());
  });
});

// Global error handler middleware
app.use(globalErrorHandler);

// start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${envMode} Mode 🚀`);
});

export { adminSecretKey, envMode, userSocketIDs };
