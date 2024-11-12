// middleware/authorization.js

const jwt = require("jsonwebtoken");
const logger = require("./logger");

const authorize = (req, res, next) => {
  console.log("into the authorize");
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded; // Attach the entire decoded token payload
    next();
  } catch (error) {
    logger.error("Invalid token:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authorize;
