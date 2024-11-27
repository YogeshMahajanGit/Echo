import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
} from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";

const userRouter = express.Router();

//Routes for user
userRouter.post("/new", singleAvatar, newUser);
userRouter.post("/login", login);

//Routes with auth
userRouter.get("/me", authenticate, getMyProfile);
userRouter.get("/logout", authenticate, logout);

export default userRouter;
