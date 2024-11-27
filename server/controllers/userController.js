import { compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { sendWebToken } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// create a new user
async function newUser(req, res, next) {
  const { name, username, password, bio } = req.body;

  // Validation
  if (!name || !username || !password) {
    return next(new ErrorHandler("All fields are required"));
  }

  let userName;

  try {
    userName = await User.findOne({ name });

    if (userName) {
      return next(
        new ErrorHandler("User already exists with this email or username")
      );
    }
  } catch (err) {
    return next(new ErrorHandler("Error while checking existing user"));
  }

  const avatar = {
    public_id: "ddddcd",
    url: "http://kk",
  };

  let user;

  // Creating a new user
  try {
    user = await User.create({
      name,
      bio,
      username,
      password,
      avatar,
    });
  } catch (err) {
    return next(new ErrorHandler("Error while creating user"));
  }

  // Send token
  try {
    sendWebToken(res, user, 201, "User created");
  } catch (err) {
    next(new Error("Something went wrong during registration"));
  }
}

//User Login
async function login(req, res, next) {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return next(new ErrorHandler("All fields required"));
  }

  let user;
  try {
    // Database call
    user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }
  } catch (error) {
    return next(new ErrorHandler("Error fetching user from database"));
  }

  let isMatch;

  try {
    // Password comparison
    isMatch = await compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler("Password incorrect!", 401));
    }
  } catch (error) {
    return next(new ErrorHandler("Error during password comparison"));
  }

  // Send token
  try {
    sendWebToken(res, user, 200, `Welcome back, ${user.name}`);
  } catch (error) {
    next(new Error("Something went wrong during login"));
  }
}

async function getMyProfile(req, res) {
  // return await user.findById
}

export { login, newUser, getMyProfile };
