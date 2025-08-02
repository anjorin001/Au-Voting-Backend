const voteService = require("../service/voteService");
const { sendSuccess } = require("../util/baseResponse");

const voteCandidate = async (req, res, next) => {
  try {
    const result = await voteService.voteCandidate(
      req.validated,
      req.user?.userId
    );

    await sendSuccess(res, "vote casted successfully", 200);
  } catch (err) {
    next(err);
  }
};

//TODO endpoitnt for users to see results
const ElectionResults = async (req, res, next) => {
  try {
    const result = await voteService.electionResult(
      req.validated.electionId,
      req.user?.userId
    );

    await sendSuccess(res, "Election result retrieved successfully", 200);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  voteCandidate,
  ElectionResults
};
