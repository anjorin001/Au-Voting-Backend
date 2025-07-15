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
    return sendSuccess(res, "Global elections retrieved successfully", { elections: globalElections });
  } catch (err) {
    next(err);
  }
};

const getGlobalElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated; //params
    const electionResults = await ausaService.globalElectionResults({ electionId });
    return sendSuccess(res, "Global election results retrieved successfully", { election: electionResults });
  } catch (err) {
    next(err);
  }
};

const getFacultyElections = async (req, res, next) => {
  try {
    const { faculty } = req.validated; //query
    const facultyElections = await ausaService.facultyElections({ faculty });
    return sendSuccess(res, "Faculty elections retrieved successfully", { elections: facultyElections });
  } catch (err) {
    next(err);
  }
};

const getFacultyElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated; // params
    const electionResults = await ausaService.facultyElectionResults({ electionId });
    return sendSuccess(res, "Faculty election results retrieved successfully", { election: electionResults });
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
};
