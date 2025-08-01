const ausaService = require("../service/ausaService");
const { sendSuccess } = require("../util/baseResponse");

const getAusaMetrics = async (req, res, next) => {
  try {
    const metrics = await ausaService.ausaMetrics();
    return sendSuccess(
      res,
      "AUSA dashboard metrics retrieved successfully",
      200,
      { metrics }
    );
  } catch (err) {
    next(err);
  }
};

const getGlobalElections = async (req, res, next) => {
  try {
    const { status } = req.validated;
    const globalElections = await ausaService.globalElections({ status });
    const statusText = status ? ` with status '${status}'` : "";
    return sendSuccess(
      res,
      `Global elections${statusText} retrieved successfully`,
      200,
      {
        elections: globalElections,
        count: globalElections.length,
      }
    );
  } catch (err) {
    next(err);
  }
};

const getGlobalElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated;
    const electionResults = await ausaService.globalElectionResults({
      electionId,
    });
    return sendSuccess(
      res,
      `Global election '${electionResults.title}' results retrieved successfully`,
      200,
      {
        election: electionResults,
      }
    );
  } catch (err) {
    next(err);
  }
};

const getFacultyElections = async (req, res, next) => {
  try {
    const { facultyName } = req.validated;
    const facultyElections = await ausaService.facultyElections({
      facultyName,
    });
    const facultyText = facultyName
      ? ` for ${facultyName} faculty`
      : " for all faculties";
    return sendSuccess(
      res,
      `Faculty elections${facultyText} retrieved successfully`,
      200,
      {
        elections: facultyElections,
        count: facultyElections.length,
      }
    );
  } catch (err) {
    next(err);
  }
};

const getFacultyElectionResults = async (req, res, next) => {
  try {
    const { electionId } = req.validated;
    const electionResults = await ausaService.facultyElectionResults({
      electionId,
    });
    return sendSuccess(
      res,
      `Faculty election '${electionResults.title}' results retrieved successfully`,
      200,
      {
        election: electionResults,
      }
    );
  } catch (err) {
    next(err);
  }
};

const createGlobalElection = async (req, res, next) => {
  try {
    const createdElection = await ausaService.createGlbElection(
      req.validated,
      (createdBy = req.user.userId)
    );
    return sendSuccess(
      res,
      `Global election '${req.validated.title}' created and scheduled successfully`,
      201,
      {
        election: createdElection,
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

const getGlobalCandidates = async (req, res, next) => {
  try {
    const { facultyName, matricNo } = req.validated;
    const globalCandidates = await ausaService.getGlbCandidates({
      facultyName,
      matricNo,
    });

    let filterText = "";
    if (facultyName && matricNo) {
      filterText = ` matching faculty '${facultyName}' and matric '${matricNo}'`;
    } else if (facultyName) {
      filterText = ` from ${facultyName} faculty`;
    } else if (matricNo) {
      filterText = ` with matric number '${matricNo}'`;
    }

    return sendSuccess(
      res,
      `Potential candidates${filterText} retrieved successfully`,
      200,
      {
        candidates: globalCandidates,
        count: globalCandidates.length,
      }
    );
  } catch (err) {
    next(err);
  }
};

const getFaculties = async (req, res, next) => {
  try {
    console.log("req for id from query", req.validated);
    const faculties = await ausaService.getFaculties(req.validated);
    const isArray = Array.isArray(faculties);
    const message = isArray
      ? `All faculties (${faculties.length}) retrieved successfully`
      : `Faculty '${faculties.name}' details retrieved successfully`;

    return sendSuccess(res, message, 200, {
      [isArray ? "faculties" : "faculty"]: faculties,
    });
  } catch (err) {
    next(err);
  }
};

const getUserToPromote = async (req, res, next) => {
  try {
    const { matricNo, facultyName } = req.validated;
    const user = await ausaService.getuserToPromote(matricNo, facultyName);
    return sendSuccess(
      res,
      `User ${user.firstname} ${user.surname} (${matricNo}) eligible for faculty admin promotion`,
      200,
      {
        user,
      }
    );
  } catch (err) {
    next(err);
  }
};

const addfacultyAdmin = async (req, res, next) => {
  try {
    const { matricNo, facultyName } = req.validated;
    const addedUser = await ausaService.addFacultyAdmin(matricNo, facultyName);
    return sendSuccess(
      res,
      `${addedUser.firstname} ${addedUser.surname} successfully promoted to ${facultyName} faculty administrator`,
      200,
      {
        addedUser,
      }
    );
  } catch (err) {
    next(err);
  }
};

const getFacultyAdmin = async (req, res, next) => {
  try {
    const { facultyName } = req.validated;
    const admins = await ausaService.getFacultyAdmin(facultyName);
    const adminCount = admins.admin?.length || 0;
    return sendSuccess(
      res,
      `${facultyName} faculty administrators (${adminCount}) retrieved successfully`,
      200,
      {
        faculty: admins,
        adminCount,
      }
    );
  } catch (err) {
    next(err);
  }
};

const removeFacultyAdmin = async (req, res, next) => {
  try {
    const { matricNo, facultyName } = req.validated;
    const user = await ausaService.removeFacultyAdmin(matricNo, facultyName);
    return sendSuccess(
      res,
      `${user.firstname} ${user.surname} successfully removed from ${facultyName} faculty administration`,
      200,
      {
        user,
      }
    );
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
  getGlobalCandidates,
  getFaculties,
  getUserToPromote,
  addfacultyAdmin,
  getFacultyAdmin,
  removeFacultyAdmin,
};
