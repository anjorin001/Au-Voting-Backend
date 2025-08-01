const { UnauthorizedError } = require("../exceptions/baseError");

function checkRole(requiredRole) {
  return function (req, res, next) {
    if (req.user?.role !== requiredRole) {
      return next(new UnauthorizedError("Access denied"));
    }
    return next();
  };
}

module.exports = checkRole;
