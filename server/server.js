import express from "express";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";

dotenv.config({
  path: "./.env",
});

const app = express();

// middleware
app.use(express.json());

const urlDB = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

connectDB(urlDB);

// Routes
app.use("/api/user", userRouter);

//testing
app.get("/", (req, res) => {
  res.send("Welcome Home");
});

app.use(globalErrorHandler);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
