const {
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../exceptions/baseError");
const Election = require("../models/electionModel");
const { Result } = require("../models/resultModel");
const User = require("../models/userModel");
const VoteLog = require("../models/voteLogModel");
const verifiedUser = require("../util/VerifyChecker");

class VoteService {
  async voteCandidate(data, userId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("user not found");

    const verified = await verifiedUser(user);
    if (!verified) throw new ForbiddenError("user not verified");

    const election = await Election.findById(data.electionId);
    if (!election) throw new NotFoundError("election not found");

    if (!election.candidates.includes(data.candidateId)) {
      throw new NotFoundError("Candidate does not belong to this election");
    }

    if (!election.general && user.faculty !== election.faculty)
      throw new ForbiddenError(
        "You are not allowed to vote in this faculty election"
      );

    const ongoing = election.status == "ongoing" ? true : false;
    if (!ongoing)
      throw new ForbiddenError("voting can only occur on an ongoing election");

    if (election.candidates.includes(userId))
      throw new ForbiddenError("candidates cannot vote in their own election");

    const voted = await VoteLog.findOne({
      user: userId,
      election: data.electionId,
    });
    if (voted)
      throw new ConflictError("user can only vote once in an election");

    const existing = await Result.findOne({ election: data.electionId });

    if (!existing) {
      await Result.create({
        election: data.electionId,
        votes: [{ candidate: data.candidateId, vote: 1 }],
      });
    } else {
      const result = await Result.findOneAndUpdate(
        { election: data.electionId },
        {
          $inc: { "votes.$[elem].vote": 1 },
        },
        {
          arrayFilters: [{ "elem.candidate": data.candidateId }],
          new: true,
        }
      );
    }

    await VoteLog.create({
      user: userId,
      election: data.electionId,
      candidate: data.candidateId,
      votedAt: new Date(),
    });

    return true;
  }
  async electionResult(electionId, userId) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError("user not found");

    const election = await Election.findById(electionId);
    if (!election) throw new NotFoundError("election not found");

    if (!election.showLiveResults && election.status !== "ended")
      return res.status(403).json({ message: "Live results disabled" });

    const result = await Result.findOne({ election: electionId }).populate("votes.candidate", "firstname surname");

    return result;
  }
}

module.exports = new VoteService();
