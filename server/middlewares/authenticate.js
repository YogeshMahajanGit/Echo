import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../server.js";
import { APP_TOKEN } from "../config/config.js";
import { User } from "../models/userModel.js";

function authenticate(req, res, next) {
  //Get token
  const token = req.cookies[APP_TOKEN];

  if (!token) {
    return next(
      new ErrorHandler("Unauthorized access. Please log in again", 401)
    );
  }

  //Token verification
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded._id;
  } catch (error) {
    return next(new ErrorHandler("Token not verify", 401));
  }

  next();
}

function authenticateAdmin(req, res, next) {
  const token = req.cookies["echo-admin-token"];

  if (!token) return next(new ErrorHandler("Access denied!", 401));

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatch = secretKey === adminSecretKey;

  if (!isMatch) {
    return next(new ErrorHandler("Access denied!", 401));
  }

  next();
}

async function socketAuthenticate(err, socket, next) {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies[APP_TOKEN];
    if (!authToken) return next(new ErrorHandler("Access denied!"), 401);

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) return next(new ErrorHandler("Access denied!"), 401);

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    next(new ErrorHandler("Access denied!", 401));
  }
}

export { authenticate, authenticateAdmin, socketAuthenticate };
