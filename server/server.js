import express from "express";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

const urlDB = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;
export const adminSecretKey = process.env.ADMIN_SECRET_KEY;

connectDB(urlDB);

// Routes
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);

//testing
app.get("/", (req, res) => {
  res.send("Welcome Developer");
});

app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
