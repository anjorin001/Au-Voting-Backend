const { sendError } = require("../util/baseResponse");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return sendError(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500,
  );
};

module.exports = errorHandler;