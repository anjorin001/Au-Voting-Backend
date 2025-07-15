const Election = require("../models/electionModel");
const User = require("../models/userModel");

class AusaService {
  async ausaMetrics() {
    const activeUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ verified: true });
    const ongoingVotes = await Election.countDocuments({ status: "ongoing" });
    const previousVotes = await Election.countDocuments({ status: "ended" });
    const upcomingVotes = await Election.countDocuments({ status: "upcoming" });

    return {
      activeUsers,
      verifiedUsers,
      ongoingVotes, // Fixed: "onogoingVotes" -> "ongoingVotes"
      previousVotes,
      upcomingVotes,
    };
  }

  async globalElections({ status = null } = {}) {//TODO use this for normal user get elections
    const filter = { general: true };
    if (status) filter.status = status;
    
    const globalElections = await Election.find(filter)
      .select("-faculty -createdBy -createdAt")
      .populate("candidates", "firstname surname")
      .sort({ createdAt: -1 });
      
    return globalElections;
  }


  async globalElectionResults({ electionId }) { 
    if (!electionId) throw new ValidationError("Election ID is required");

    const election = await Election.findById(electionId)
      .select("result title status candidates general")
      .populate("candidates", "firstname surname");

    if (!election) throw new NotFoundError("Election not found");

    if (!election.general)
      throw new ValidationError("This is not a global election");

    return election;
  }

  async facultyElections({ faculty = null } = {}) {
    const filter = { general: false };
    if (faculty) filter.faculty = faculty;

    const facultyElections = await Election.find(filter)
      .select("-createdBy -createdAt")
      .populate("candidates", "firstname surname faculty");

    return facultyElections;
  }

  async facultyElectionResults({ electionId }) {
    if (!electionId) throw new ValidationError("Election ID is required");
    
    const election = await Election.findById(electionId)
      .select("result title status faculty candidates")
      .populate("candidates", "firstname surname faculty");
      
    if (!election) throw new NotFoundError("Election not found");
    
    if (election.general) throw new ValidationError("This is not a faculty election");
    
    return election;
  }
}

module.exports = new AusaService();
