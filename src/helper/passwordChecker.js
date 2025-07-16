const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const genSalt = await bcrypt.genSalt(saltRounds);
    const hPassword = await bcrypt.hash(password, genSalt);
    return hPassword;
  } catch (err) {
    throw err;
  }
};

const comparePassword = async (newPassword, existingPassword) => {
  try {
    const passMatch = await bcrypt.compare(newPassword, existingPassword);
    return passMatch;
  } catch (err) {
    throw err;
  }
};
module.exports = { hashPassword, comparePassword };
