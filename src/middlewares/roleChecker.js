const { UnauthorizedError } = require("../exception/baseError");

function checkRole(requiredRole) {
  return function (req, res, next) {
    if (req.user?.role === requiredRole) {
      return next();
    }
    return next(new UnauthorizedError("Access denied"));
  };
}

module.exports = checkRole;