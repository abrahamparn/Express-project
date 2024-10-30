const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { hashPassword, comparePassword, createToken } = require("../utils/password");
const { error } = require("../utils/logger");
const authRouter = express.Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const { username = "", password = "", name = "" } = req.body;

    // body checker
    if (!username.trim() || !password.trim() || !name.trim()) {
      return res.status(400).json({ error: "username,  password, and name are required" });
    }
    if (username.length < 6) {
      return res.status(400).json({ error: "username must be more than 5 characters long" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "password must be more than 5 characters long" });
    }

    // database checker
    const userExists = await userModel.checkUsername(username);
    if (userExists) {
      return res.status(400).json({ error: "username already exists, please choose another one." });
    }

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
});

authRouter.post("/login", async (req, res, next) => {
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
});
module.exports = authRouter;
