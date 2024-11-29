import express from "express";
import {
  handleGetMyProfile,
  handleLogin,
  handleLogout,
  handleNewUser,
  handleSearchUser,
} from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleValidator,
  loginValidator,
  registerValidator,
} from "../lib/validators.js";

const userRouter = express.Router();

//Routes for user
userRouter.post(
  "/new",
  singleAvatar,
  registerValidator(),
  handleValidator,
  handleNewUser
);
userRouter.post("/login", loginValidator(), handleValidator, handleLogin);

//Routes with auth
userRouter.get("/me", authenticate, handleGetMyProfile);
userRouter.get("/logout", authenticate, handleLogout);
userRouter.get("/search", authenticate, handleSearchUser);

export default userRouter;
