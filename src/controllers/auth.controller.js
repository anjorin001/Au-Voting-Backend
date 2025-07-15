const userAuthService = require("../service/userService");
const { sendSuccess } = require("../util/baseResponse");

const userSignup = async (req, res, next) => {
  try {
    const token = await userAuthService.signup(req.validated);
    return sendSuccess(res, "User registered successfully", 201, { token });
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const token = await userAuthService.login(req.validated);
    return sendSuccess(res, "User login successful", 200, { token });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  userSignup,
  userLogin,
};
