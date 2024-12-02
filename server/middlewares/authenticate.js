import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../server.js";

function authenticate(req, res, next) {
  //Get token
  const token = req.cookies["echo-token"];

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

export { authenticate, authenticateAdmin };
