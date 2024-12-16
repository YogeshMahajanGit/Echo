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

chatRouter.use(authenticate);

chatRouter.post(
  "/newGroup",
  newGroupValidator(),
  handleValidator,
  handleNewGroupChat
);

chatRouter.get("/my", handleGetMyChatMessage);

chatRouter.get("/my/groups", handleGetMyGroups);

chatRouter.put(
  "/addmembers",
  addMemberValidator(),
  handleValidator,
  handleAddMemberGroup
);

chatRouter.put(
  "/removemembers",
  removeMemberValidator(),
  handleValidator,
  handleRemoveMemberGroup
);

chatRouter.delete(
  "/leavegroup/:id",
  chatIdValidator(),
  handleValidator,
  handleLeaveGroup
);

chatRouter.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  handleValidator,
  handleSendAttachments
);

chatRouter.get(
  "/message/:id",
  chatIdValidator(),
  handleValidator,
  handleGetMessages
);

chatRouter
  .route("/:id")
  .get(chatIdValidator(), handleValidator, handleGetChatDetails)
  .put(renameGroupValidator(), handleValidator, handleRenameGroup)
  .delete(chatIdValidator(), handleValidator, handleDeleteChat);

export default chatRouter;
