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
userRouter.get("/me", authenticate, handleGetMyProfile);

userRouter.get("/logout", authenticate, handleLogout);

userRouter.get("/search", authenticate, handleSearchUser);

userRouter.put(
  "/send-request",
  authenticate,
  requestValidator(),
  handleValidator,
  handleFriendRequest
);

userRouter.put(
  "/accept-request",
  authenticate,
  acceptRequestValidator(),
  handleValidator,
  handleAcceptFriendRequest
);

userRouter.get("/notifications", authenticate, handleUserNotifications);

userRouter.get("/friends", authenticate, handleGetMyFriends);

export default userRouter;
