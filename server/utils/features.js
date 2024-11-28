import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 2 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

function sendWebToken(res, user, code, message) {
  // Token generation JWT
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("echo-token", token, cookieOptions).json({
    success: true,
    message,
  });
}

function emitEvent(req, event, user, data) {
  console.log("emmit");
}

export { sendWebToken, cookieOptions, emitEvent };
