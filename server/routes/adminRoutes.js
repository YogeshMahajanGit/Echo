import express from "express";
import {
  handleAdminLogin,
  handleAdminLogout,
  handleGetAdminData,
  handleGetAllChats,
  handleGetAllMessages,
  handleGetAllUsers,
  handleGetDashboardStats,
} from "../controllers/adminController.js";
import { adminLoginValidator, handleValidator } from "../lib/validators.js";
import { authenticateAdmin } from "../middlewares/authenticate.js";

const adminRouter = express.Router();

//Routes for Admin
adminRouter.post(
  "/verify",
  adminLoginValidator(),
  handleValidator,
  handleAdminLogin
);
adminRouter.get("/logout", handleAdminLogout);

// Protected routes
adminRouter.use(authenticateAdmin);

adminRouter.get("/", handleGetAdminData);
adminRouter.get("/users", handleGetAllUsers);
adminRouter.get("/chats", handleGetAllChats);
adminRouter.get("/messages", handleGetAllMessages);
adminRouter.get("/stats", handleGetDashboardStats);

export default adminRouter;
