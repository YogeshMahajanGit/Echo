import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.js";

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

async function uploadFilesToCloudinary(files = []) {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  });

  // handle all promises
  try {
    const results = await Promise.all(uploadPromises);

    const formatResult = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));

    return formatResult;
  } catch (error) {
    throw new Error("Error while uploading files", error);
  }
}

function deleteFilesFromCloudinary(public_ids) {}

export {
  sendWebToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
