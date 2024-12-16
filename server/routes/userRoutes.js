import express from "express";
import {
  handleAcceptFriendRequest,
  handleUserNotifications,
  handleFriendRequest,
  handleGetMyProfile,
  handleLogin,
  handleLogout,
  handleNewUser,
  handleSearchUser,
  handleGetMyFriends,
} from "../controllers/userController.js";
import { singleAvatar } from "../middlewares/multer.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  acceptRequestValidator,
  handleValidator,
  loginValidator,
  registerValidator,
  requestValidator,
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
userRouter.use(authenticate);

userRouter.get("/me", handleGetMyProfile);

userRouter.get("/logout", handleLogout);

userRouter.get("/search", handleSearchUser);

userRouter.put(
  "/send-request",
  requestValidator(),
  handleValidator,
  handleFriendRequest
);

userRouter.put(
  "/accept-request",
  acceptRequestValidator(),
  handleValidator,
  handleAcceptFriendRequest
);

userRouter.get("/notifications", handleUserNotifications);

userRouter.get("/friends", handleGetMyFriends);

export default userRouter;
