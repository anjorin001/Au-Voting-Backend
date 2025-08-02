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

const ElectionResults = async (req, res, next) => {
  try {
    const result = await voteService.electionResult(
      req.validated.electionId,
      req.user?.userId
    );
    console.log("election result", result)

    await sendSuccess(res, "Election result retrieved successfully", 200, result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  voteCandidate,
  ElectionResults
};
