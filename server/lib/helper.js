import { userSocketIDs } from "../server.js";

export const getOtherMember = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

export const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user.toString()));

//  binary data into ASCII text
export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
