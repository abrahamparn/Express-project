// middleware/middleware.js

const logger = require("./logger");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

// Define log directory
const logDirectory = path.join(__dirname, "../logFiles");

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// Define morgan logger with Winston stream
const morganLogger = morgan("combined", { stream: logger.stream });

// Request Logger Middleware
const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method}`);
  logger.info(`Path:   ${req.path}`);
  logger.info(`Body:   ${JSON.stringify(req.body)}`);
  logger.info("---");
  next();
};

// Unknown Endpoint Middleware
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  morganLogger,
  requestLogger,
  unknownEndpoint,
};
