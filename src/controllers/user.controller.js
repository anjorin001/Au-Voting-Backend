const userAuthService = require("../service/userService");
const { sendSuccess } = require("../util/baseResponse");

const getProfile = async (req, res, next) => {
  try {
    const user = await userAuthService.getProfile({ userId: req.user.userId });
    return sendSuccess(res, "Profile retrieved successfully", { user });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userAuthService.updateProfile({
      userId: req.user.userId,
      newData: req.validated,
    });
    return sendSuccess(res, "Profile updated successfully", {
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const deletedUser = await userAuthService.deleteProfile({
      userId: req.user.userId,
    });
    return sendSuccess(res, "Profile deleted successfully", {
      user: deletedUser,
    });
  } catch (err) {
    next(err);
  }
};

// const verifyProfile = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const verifiedUser = await userAuthService.verifyProfile({
//       userId,
//       adminId: req.user.userId
//     });
//     return sendSuccess(res, "User verified successfully", { user: verifiedUser });
//   } catch (err) {
//     next(err);
//   }
// };

const getVerifyStatus = async (req, res, next) => {
  try {
    const status = await userAuthService.verifyStatus({
      userId: req.user.userId,
    });
    return sendSuccess(res, "Verification status retrieved", { status });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validated;
    const result = await userAuthService.updatePassword({
      userId: req.user.userId,
      currentPassword,
      newPassword,
    });
    return sendSuccess(res, result.message);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
  verifyProfile,
  getVerifyStatus,
  updatePassword,
};
