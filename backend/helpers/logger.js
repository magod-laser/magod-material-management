const winston = require("winston");
const { format } = require("winston");
const moment = require("moment-timezone");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Define a custom timestamp format function for IST
const customTimestamp = format((info) => {
  info.timestamp = moment().tz("Asia/Kolkata").format();
  return info;
});

const logDir = path.join(__dirname, "../loggers");

// Common format
const logFormat = format.combine(
  format.timestamp(),
  customTimestamp(),
  format.json(),
  format.prettyPrint()
);

// Create an info logger with daily rotation
const infoLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "info-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "info",
      format: logFormat,
    }),
  ],
});

// Create an error logger with daily rotation
const errorLogger = winston.createLogger({
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      format: logFormat,
    }),
  ],
});

// Unified logger for convenience
const logger = {
  info: (message, meta) => {
    infoLogger.info(message, meta);
  },
  error: (message, meta) => {
    errorLogger.error(message, meta);
  },
};

module.exports = { infoLogger, errorLogger, logger };
