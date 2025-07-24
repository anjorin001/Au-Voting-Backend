const express = require("express");
const authenticationMiddleware = require("../middlewares/authMiddeware");
const validate = require("../middlewares/requestValidator");
const {
  globalElectionsQueryValidator,
  facultyElectionsQueryValidator,
  electionIdParamValidator,
  createGlobalElectionValidator,
  globalCandidatesQueryValidator,
  facultyAdminQueryValidator,
  removeFacultyAdminValidator,
} = require("../validators/ausaValidators");
const {
  getAusaMetrics,
  getGlobalElections,
  getGlobalElectionResults,
  getFacultyElections,
  getFacultyElectionResults,
  createGlobalElection,
  getGlobalCandidates,
  getFaculties,
  getUserToPromote,
  addfacultyAdmin,
  getFacultyAdmin,
  removeFacultyAdmin,
} = require("../controllers/ausa.controller");
const checkRole = require("../middlewares/roleChecker");

const router = express.Router();

router.use(authenticationMiddleware);
router.use(checkRole("super-admin"));

// Metrics
router.get("/metrics", getAusaMetrics);

// Elections
router.get("/global-elections", validate(globalElectionsQueryValidator), getGlobalElections);
router.get("/faculty-elections", validate(facultyElectionsQueryValidator), getFacultyElections);

// Results
router.get("/global-results/:electionId", validate(electionIdParamValidator), getGlobalElectionResults);
router.get("/faculty-results/:electionId", validate(electionIdParamValidator), getFacultyElectionResults);

// Global election creation
router.post("/global-election", validate(createGlobalElectionValidator), createGlobalElection);
router.get("/global-candidates", validate(globalCandidatesQueryValidator), getGlobalCandidates);

// haandle faculty admin

// get all faculty
// get faculty by id
router.get("/faculty", getFaculties);

// add admin, remove admin
router.get("/for-faculty-admin", validate(globalCandidatesQueryValidator), getUserToPromote)
router.post("/assign-faculty-admin",validate(globalCandidatesQueryValidator), addfacultyAdmin )
router.get("/faculty-admin/:facultyId", validate(facultyAdminQueryValidator), getFacultyAdmin);
router.patch("/remove-faculty-admin", validate(removeFacultyAdminValidator), removeFacultyAdmin);

module.exports = router;
