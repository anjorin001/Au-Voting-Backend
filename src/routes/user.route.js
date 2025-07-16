const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const validate = require("../middlewares/requestValidator");
const { 
  updateProfileValidator, 
  updatePasswordValidator 
} = require("../validators/userValidators");
const { 
  getProfile, 
  updateProfile, 
  updatePassword, 
  deleteProfile, 
  getVerifyStatus 
} = require("../controllers/user.controller");

const router = express.Router();

router.use(authenticationMiddleware);

// Profile routes
router.get("/profile", getProfile);
router.patch("/update-profile", validate(updateProfileValidator), updateProfile);
router.delete("/delete-profile", deleteProfile);
router.get("/profile-status", getVerifyStatus);
router.patch("/update-password", validate(updatePasswordValidator), updatePassword);

module.exports = router;
