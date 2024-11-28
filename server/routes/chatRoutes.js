import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  addMemberGroup,
  getChatDetails,
  getMyChatMessage,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMemberGroup,
  sendAttachments,
} from "../controllers/chatController.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const chatRouter = express.Router();

//Routes for chat
chatRouter.post("/newGroup", authenticate, newGroupChat);

chatRouter.get("/my", authenticate, getMyChatMessage);

chatRouter.get("/my/groups", authenticate, getMyGroups);

chatRouter.put("/addmembers", authenticate, addMemberGroup);

chatRouter.delete("/removemembers", authenticate, removeMemberGroup);

chatRouter.delete("/leavegroup/:id", authenticate, leaveGroup);

chatRouter.post("/message", authenticate, attachmentsMulter, sendAttachments);

chatRouter.route("/:id", authenticate).get(getChatDetails);

export default chatRouter;
