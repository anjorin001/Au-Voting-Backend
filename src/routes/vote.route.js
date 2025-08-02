const express = require("express");
const validate = require("../middlewares/requestValidator");
const { voteSchemaValidator } = require("../validators/voteValidators");
const { voteCandidate } = require("../controllers/vote.controller");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const router = express.Router();


router.use(authenticationMiddleware);

router.post("/cast-vote/:electionId/:candidateId", validate(voteSchemaValidator), voteCandidate);
// router.get("/result")
//TODO test this before moving to the next ... admin
module.exports = router;
