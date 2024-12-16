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

  const response = {
    success: false,
    message: err.message,
  };

  if (envMode === "DEVELOPMENT") {
    response.error = err;
  }

<<<<<<< HEAD
  res.status(err.statusCode || 500).json(response);

=======
  res.status(err.statusCode).json(response);
>>>>>>> 2b262d1ed7ea6228942ffae4e5c01aacbb663b70
}

export { globalErrorHandler };
