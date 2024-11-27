import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";

function authenticate(req, res, next) {
  //Get token
  const token = req.cookies["echo-token"];

  if (!token) {
    return next(new ErrorHandler("Authorization is NOT Valid", 402));
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

export { authenticate };
