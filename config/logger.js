const winston = require("winston");

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  level: "debug",
  transports: [
    new winston.transports.File({
      filename: "./logs/errors.log",
      maxsize: 5242880,
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

module.exports = logger;
