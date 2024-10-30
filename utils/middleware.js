const logger = require("./logger");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const logDirectory = path.join(__dirname, "../logFiles");

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = fs.createWriteStream(path.join(logDirectory, "development.txt"), {
  flags: "a",
});

const morganLogger = morgan("combined", { stream: accessLogStream });

const requestLogger = (request, response, next) => {
  logger.info(`Method: ${request.method}`);
  logger.info(`Path:   ${request.path}`);
  logger.info(`Body:   ${JSON.stringify(request.body)}`);
  logger.info("---");

  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

module.exports = {
  morganLogger,
  requestLogger,
  unknownEndpoint,
};
