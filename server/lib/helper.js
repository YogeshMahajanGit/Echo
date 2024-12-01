import { userSocketIDs } from "../server.js";

export const getOtherMember = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

export const getSockets = (users = []) =>
  users.map((user) => userSocketIDs.get(user._id.toString()));
