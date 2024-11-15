// middleware/errorHandler.js

const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message}`);

  if (process.env.NODE_ENV === "production") {
    res.status(500).json({ error: "Internal Server Error" });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
};

module.exports = errorHandler;
