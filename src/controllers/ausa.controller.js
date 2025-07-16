const ausaService = require("../service/ausaService");
const { sendSuccess } = require("../util/baseResponse");

const getAusaMetrics = async (req, res, next) => {
  try {
    const metrics = await ausaService.ausaMetrics();
    return sendSuccess(res, "AUSA metrics retrieved successfully", { metrics });
  } catch (err) {
    next(err);
  }
};

const getGlobalElections = async (req, res, next) => {
  try {
    const { status } = req.validated; //query
    const globalElections = await ausaService.globalElections({ status });
    return sendSuccess(res, "Global elections retrieved successfully", {
      elections: globalElections,
    });
  } catch (err) {
    next(err);
  }
};

const getGlobalElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated; //params
    const electionResults = await ausaService.globalElectionResults({
      electionId,
    });
    return sendSuccess(res, "Global election results retrieved successfully", {
      election: electionResults,
    });
  } catch (err) {
    next(err);
  }
};

const getFacultyElections = async (req, res, next) => {
  try {
    const { faculty } = req.validated; //query
    const facultyElections = await ausaService.facultyElections({ faculty });
    return sendSuccess(res, "Faculty elections retrieved successfully", {
      elections: facultyElections,
    });
  } catch (err) {
    next(err);
  }
};

const getFacultyElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated; // params
    const electionResults = await ausaService.facultyElectionResults({
      electionId,
    });
    return sendSuccess(res, "Faculty election results retrieved successfully", {
      election: electionResults,
    });
  } catch (err) {
    next(err);
  }
};

const createGlobalElection = async (req, res, next) => {
  try {
    const createdElection = await ausaService.createGlbElection(req.validated); //query
    return sendSuccess(res, "Global election created successfully", {
      election: createdElection,
    }, 201); // Added 201 status code for creation
  } catch (err) {
    next(err);
  }
};

const getGlobalCandidates = async (req, res, next) => {
  try {
    const { faculty, matricNo } = req.validated; //query
    const globalCandidates = await ausaService.getGlbCandidates({
      faculty,
      matricNo,
    });
    return sendSuccess(res, "candidates retrieved successfully", {
      candidates: globalCandidates,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAusaMetrics,
  getGlobalElections,
  getGlobalElectionResults,
  getFacultyElections,
  getFacultyElectionResults,
  createGlobalElection,
  getGlobalCandidates
};
