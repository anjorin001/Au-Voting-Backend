const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const { getProfile, updatePassword, deleteProfile, verifyProfile, getVerifyStatus } = require("../controllers/user.controller");
const router = express.Router();

router.use(authenticationMiddleware)

router.get("/profile", getProfile);
router.patch("/update-profile", updatePassword);
router.delete("/delete-profile", deleteProfile);
// router.post("/profile", userLogin);
router.get("/profile-status", getVerifyStatus);
router.patch("/profile-updatePassword", updatePassword);

module.exports = router;
