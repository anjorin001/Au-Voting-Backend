const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const { userSignup, userLogin } = require("../controllers/auth.controller");
const validate = require("../middlewares/requestValidator");
const { signupValidator, loginValidator } = require("../validators/authValidators");
const router = express.Router();

router.post("/signup", validate(signupValidator), userSignup);
router.post("/login",validate(loginValidator), userLogin);

module.exports = router;
