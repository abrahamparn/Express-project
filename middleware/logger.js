const { createLogger, format, transports } = require("winston");
const path = require("path");
const DailyRotateFile = require("winston-daily-rotate-file");

const logDirectory = path.join(__dirname, "../logFiles");

// Create logger
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
      level: "debug",
    }),
    // File transport for errors
    new DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
    // File transport for combined logs
    new DailyRotateFile({
      filename: path.join(logDirectory, "combined-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// Stream for morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = logger;
