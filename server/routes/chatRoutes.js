import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  addMemberGroup,
  getMyChatMessage,
  getMyGroups,
  newGroupChat,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

//Routes for chat
chatRouter.post("/newGroup", authenticate, newGroupChat);

chatRouter.get("/my", authenticate, getMyChatMessage);

chatRouter.get("/my/groups", authenticate, getMyGroups);

chatRouter.put("/addmembers", authenticate, addMemberGroup);

export default chatRouter;
