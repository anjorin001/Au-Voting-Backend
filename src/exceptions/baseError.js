const httpStatus = require("http-status-codes").StatusCodes;

class BaseError extends Error {
  constructor(name, statusCode, isOperational, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype); // correct inheritance
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

class ValidationError extends BaseError {
  constructor(description = "Invalid input") {
    super("ValidationError", httpStatus.BAD_REQUEST, true, description);
  }
}

class UnauthorizedError extends BaseError {
  constructor(description = "Unauthorized access") {
    super("UnauthorizedError", httpStatus.UNAUTHORIZED, true, description);
  }
}

class NotFoundError extends BaseError {
  constructor(description = "Resource not found") {
    super("NotFoundError", httpStatus.NOT_FOUND, true, description);
  }
}

class ConflictError extends BaseError {
  constructor(description = "Conflict occurred") {
    super("ConflictError", httpStatus.CONFLICT, true, description);
  }
}

module.exports = {
  BaseError,
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
};
