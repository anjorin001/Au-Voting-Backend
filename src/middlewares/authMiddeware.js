const { UnauthorizedError } = require("../exceptions/baseError");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(new UnauthorizedError("Authorization is missing in headers"));
  try {
    const token = authHeader.split(" ")[1];
    if (!token)
      throw new UnauthorizedError("Token is missing in Authorization");
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticationMiddleware;
