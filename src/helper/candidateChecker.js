const { ValidationError } = require("../exceptions/baseError");
const User = require("../models/userModel");

const validateCandidate = async (candidates) => {
  for (let id of candidates) {
    const validUser = await User.findOne({ _id: id, verified: true });
    if (!validUser) {
      throw new ValidationError("User not found or not verified");
    }
  }
  return true;
};

module.exports = validateCandidate