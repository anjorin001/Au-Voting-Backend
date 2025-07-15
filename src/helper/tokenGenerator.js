const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = async (user) => {
  const payload = {
    userId: user._id,
    userEmail: user.email,
    userName: `${user.firstname} ${user.surname}`,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "12h" });
};

module.exports = generateToken;
