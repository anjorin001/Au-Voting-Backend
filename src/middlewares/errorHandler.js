const { sendError } = require("../util/baseResponse");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  return sendError(
    res,
    err.message || "Internal Server Error",
    err.status || 500,
  );
};

module.exports = errorHandler;