// modules/authentication/authentication.router.js

const express = require("express");
const authenticationController = require("./authentication.controller");
const authorize = require("../../middleware/authorization");
const { validateRegistration } = require("../../middleware/validation");
const { authLimiter } = require("../../middleware/authLimiter");

const router = express.Router();

// Route: POST /api/authentication/register
router.post("/register", validateRegistration, authenticationController.register);

// Route: POST /api/authentication/login
router.post("/login", authLimiter, authenticationController.login);

// Route: POST /api/authentication/change-password
router.post("/change-password", authorize, authenticationController.changePassword);

module.exports = router;
