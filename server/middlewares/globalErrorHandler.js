import { envMode } from "../server.js";

function globalErrorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  //  Duplicate key error
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(", ");
    err.message = `Duplicate key violation : ${error}`;
    err.statusCode = 400;
  }

  // cast error
  if (err.name === "CastError") {
    const pathError = err.path;
    err.message = `Invalid format of : ${pathError}`;
    err.statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message: envMode === "DEVELOPMENT" ? err : err.message,
  });
}

export { globalErrorHandler };
