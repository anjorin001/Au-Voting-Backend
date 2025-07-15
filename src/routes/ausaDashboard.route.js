const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const {
  getAusaMetrics,
  getGlobalElections,
  getGlobalElectionResults,
  getFacultyElections,
  getFacultyElectionResults,
} = require("../controllers/ausa.controller");
const checkRole = require("../middlewares/roleChecker");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(checkRole("super-admin"))

router.get("/metrics", getAusaMetrics);
router.get("/global-elections", getGlobalElections);
router.get("/faculty-elections", getFacultyElections);

router.get("/global-results/:electionId", getGlobalElectionResults);
router.get("/faculty-results/:electionId", getFacultyElectionResults);

module.exports = router;