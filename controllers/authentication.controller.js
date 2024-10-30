const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/password");
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
    if (userExists.exists) {
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

module.exports = authRouter;
