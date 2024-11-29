import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  handleAddMemberGroup,
  handleGetChatDetails,
  handleGetMyChatMessage,
  handleGetMyGroups,
  handleDeleteChat,
  handleGetMessages,
  handleLeaveGroup,
  handleNewGroupChat,
  handleRemoveMemberGroup,
  handleRenameGroup,
  handleSendAttachments,
} from "../controllers/chatController.js";
import { attachmentsMulter } from "../middlewares/multer.js";

const chatRouter = express.Router();

//Routes for chat
chatRouter.post("/newGroup", authenticate, handleNewGroupChat);

chatRouter.get("/my", authenticate, handleGetMyChatMessage);

chatRouter.get("/my/groups", authenticate, handleGetMyGroups);

chatRouter.put("/addmembers", authenticate, handleAddMemberGroup);

chatRouter.delete("/removemembers", authenticate, handleRemoveMemberGroup);

chatRouter.delete("/leavegroup/:id", authenticate, handleLeaveGroup);

chatRouter.post(
  "/message",
  authenticate,
  attachmentsMulter,
  handleSendAttachments
);

chatRouter.get("/message/:id", authenticate, handleGetMessages);

chatRouter
  .route("/:id", authenticate)
  .get(handleGetChatDetails)
  .put(handleRenameGroup)
  .delete(handleDeleteChat);

export default chatRouter;
