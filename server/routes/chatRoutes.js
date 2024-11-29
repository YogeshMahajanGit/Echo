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
import {
  addMemberValidator,
  chatIdValidator,
  handleValidator,
  newGroupValidator,
  removeMemberValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
} from "../lib/validators.js";

const chatRouter = express.Router();

//Routes for chat
chatRouter.post(
  "/newGroup",
  authenticate,
  newGroupValidator(),
  handleValidator,
  handleNewGroupChat
);

chatRouter.get("/my", authenticate, handleGetMyChatMessage);

chatRouter.get("/my/groups", authenticate, handleGetMyGroups);

chatRouter.put(
  "/addmembers",
  authenticate,
  addMemberValidator(),
  handleValidator,
  handleAddMemberGroup
);

chatRouter.delete(
  "/removemembers",
  authenticate,
  removeMemberValidator(),
  handleValidator,
  handleRemoveMemberGroup
);

chatRouter.delete(
  "/leavegroup/:id",
  authenticate,
  chatIdValidator(),
  handleValidator,
  handleLeaveGroup
);

chatRouter.post(
  "/message",
  authenticate,
  attachmentsMulter,
  sendAttachmentsValidator(),
  handleValidator,
  handleSendAttachments
);

chatRouter.get(
  "/message/:id",
  authenticate,
  chatIdValidator(),
  handleValidator,
  handleGetMessages
);

chatRouter
  .route("/:id", authenticate)
  .get(chatIdValidator(), handleValidator, handleGetChatDetails)
  .put(renameGroupValidator(), handleValidator, handleRenameGroup)
  .delete(chatIdValidator(), handleValidator, handleDeleteChat);

export default chatRouter;
