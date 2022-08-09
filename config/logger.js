const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  level: "debug",
  // log unhandled exceptions.
  exceptionHandlers: [
    new transports.File({
      filename: "./logs/errors.log",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

module.exports = logger;
