const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const { userSignup, userLogin } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/signup", userSignup);
router.post("/login", userLogin);

module.exports = router;
