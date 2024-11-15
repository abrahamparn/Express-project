// modules/authentication/authentication.controller.js

const jwt = require("jsonwebtoken");
const userModel = require("./authentication.model");
const { hashPassword, comparePassword, createToken } = require("../../utils/password");
const { error } = require("../../middleware/logger");

// Controller Function: Register
const register = async (req, res, next) => {
  try {
    const { username = "", password = "", name = "" } = req.body;

    // Check if Username Exists
    const userExists = await userModel.checkUsername(username);
    if (userExists) {
      return res.status(400).json({ error: "username already exists, please choose another one." });
    }

    // Hash Password and Create User
    const hashedPassword = await hashPassword(password);
    const newUser = await userModel.createUser(username, hashedPassword, name);
    return res.status(201).json({
      success: true,
      message: "user successfully created",
      username: newUser,
    });
  } catch (exception) {
    error(exception);
    next(exception);
  }
};

// Controller Function: Login
const login = async (req, res, next) => {
  try {
    const { username = "", password = "" } = req.body;
    if (!username.trim() || !password.trim()) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const userExists = await userModel.checkUsername(username);
    console.log("userExists", userExists);
    if (!userExists) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = await userModel.selectOneUser(username);

    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    let token = createToken(user);
    return res.status(200).json({ token: token, username: user.username });
  } catch (exception) {
    error(exception);
    next(exception);
  }
};

// Controller Function: Change Password
const changePassword = async (req, res, next) => {
  try {
    const { username = "", password = "", newPassword = "" } = req.body;

    if (!username.trim() || !password.trim() || !newPassword.trim()) {
      return res.status(400).json({ error: "username, password, and newPassword cannot be empty" });
    }
    if (req.user.username !== username) {
      return res.status(403).json({ error: "You can only change your own password" });
    }
    const userExists = await userModel.checkUsername(username);
    if (!userExists) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const user = await userModel.selectOneUser(username);

    const passwordValid = await comparePassword(password, user.password);
    if (!passwordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: "newPassword must be at least 6 characters long" });
    }
    const hashedNewPassword = await hashPassword(newPassword);

    await userModel.updatePassword(username, hashedNewPassword);

    return res.status(200).json({ success: true, message: "Password successfully updated" });
  } catch (exception) {
    error(exception);
    next(exception);
  }
};

module.exports = {
  register,
  login,
  changePassword,
};
