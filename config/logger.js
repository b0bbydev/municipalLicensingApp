const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  level: "debug",
  transports: [
    new transports.File({
      filename: "./logs/errors.log",
      maxsize: 5242880,
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

module.exports = logger;
