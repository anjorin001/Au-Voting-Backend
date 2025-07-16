const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const {
  getAusaMetrics,
  getGlobalElections,
  getGlobalElectionResults,
  getFacultyElections,
  getFacultyElectionResults,
  createGlobalElection,
  getGlobalCandidates,
} = require("../controllers/ausa.controller");
const checkRole = require("../middlewares/roleChecker");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(checkRole("super-admin"))

// metrics
router.get("/metrics", getAusaMetrics);
router.get("/global-elections", getGlobalElections);
router.get("/faculty-elections", getFacultyElections);

// resuslts
router.get("/global-results/:electionId", getGlobalElectionResults);
router.get("/faculty-results/:electionId", getFacultyElectionResults);

// global election creation
router.post("/global-election", createGlobalElection);
router.get("/global-candidates", getGlobalCandidates);

// haandle faculty admin
// get all faculty
// get faculty by id
// 

module.exports = router;