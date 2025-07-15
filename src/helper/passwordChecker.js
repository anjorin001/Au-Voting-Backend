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

const comparePassword = async (password, user) => {
  try {
    const encyptedPassword = user.password;
    const passMatch = await bcrypt.compare(password, encyptedPassword);
    return passMatch;
  } catch (err) {
    throw err;
  }
};
module.exports = { hashPassword, comparePassword };
