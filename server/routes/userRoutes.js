import express from "express";
import { login, newUser } from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";

const userRouter = express.Router();

//Routes for user
userRouter.post("/new", singleAvatar, newUser);
userRouter.post("/login", login);

export default userRouter;
