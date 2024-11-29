import { body, validationResult, check, param, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const handleValidator = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessage, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
  body("bio", "Please Enter Bio").notEmpty(),
  check("avatar", "Please Select Profile").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Username").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please Enter Group Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Select Members")
    .isArray({ min: 2, max: 20 })
    .withMessage("Please Select more then 2 members"),
];

const addMemberValidator = () => [
  body("chatId", "Please Enter  ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Select Members")
    .isArray({ min: 1, max: 20 })
    .withMessage("Please Select more then 2 members"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter  ID").notEmpty(),
  body("userId", "Please Enter user ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter  ID").notEmpty(),
  check("files")
    .notEmpty()
    .withMessage("Attachments")
    .isArray({ min: 1, max: 3 })
    .withMessage("Files must be less than 3"),
];

const getMessagesValidator = () => [param("id", "Please Enter ID").notEmpty()];

const chatIdValidator = () => [param("id", "Please Enter ID").notEmpty()];

const renameGroupValidator = () => [
  param("id", "Please Enter ID").notEmpty(),
  body("name", "Please New Name").notEmpty(),
];

export {
  handleValidator,
  registerValidator,
  loginValidator,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  getMessagesValidator,
  chatIdValidator,
  renameGroupValidator,
};
