const express = require("express");
const validate = require("../middlewares/requestValidator");
const {
  voteSchemaValidator,
  electionResultSchema,
} = require("../validators/voteValidators");
const {
  voteCandidate,
  ElectionResults,
} = require("../controllers/vote.controller");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const router = express.Router();

router.use(authenticationMiddleware);

router.post(
  "/cast-vote/:electionId/:candidateId",
  validate(voteSchemaValidator),
  voteCandidate
);
router.get(
  "/result/:electionId",
  validate(electionResultSchema),
  ElectionResults
);

module.exports = router;
