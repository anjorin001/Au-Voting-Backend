const { NotFoundError } = require("../exceptions/baseError");
const Election = require("../models/electionModel");
const Faculty = require("../models/facultyModel");
const User = require("../models/userModel");

class AusaService {
  async ausaMetrics() {
    try {
      const [
        activeUsers,
        verifiedUsers,
        ongoingVotes,
        previousVotes,
        upcomingVotes,
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ verified: true }),
        Election.countDocuments({ status: "ongoing" }),
        Election.countDocuments({ status: "ended" }),
        Election.countDocuments({ status: "upcoming" }),
      ]);

      return {
        activeUsers,
        verifiedUsers,
        ongoingVotes,
        previousVotes,
        upcomingVotes,
      };
    } catch (error) {
      throw new Error("Failed to fetch AUSA metrics");
    }
  }

  async globalElections({ status = null } = {}) {
    //TODO use this for normal user get elections
    const filter = { general: true };
    if (status) filter.status = status; // TODO 6. Add Input Validation in validator

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
    if (faculty) filter.faculty = faculty; // TODO Add Faculty Validation in validator

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

    if (election.general)
      throw new ValidationError("This is not a faculty election");

    return election;
  }

  async createGlbElection(electData) {
    const { title, general, faculty, candidates, startTime, endTime } =
      electData;
    const newElection = await Election.create({
      title,
      general,
      faculty,
      candidates,
      startTime,
      endTime,
      createdBy,
    });

    return { election: newElection };
  }

  async getGlbCandidates({ faculty = null, matricNo = null } = {}) {
    const filter = {};
    if (faculty) filter.faculty = faculty;
    if (matricNo) filter.matricNo = matricNo;

    const candidates = await User.find(filter)
      .select("-participatedElection -createdAt -role -password")
      .sort({ createdAt: -1 });

    return candidates;
  }

  async getFaculties({ facultyId = null } = {}) {
    if (facultyId) {
      const faculty = await Faculty.findById(facultyId).populate(
        "admin",
        "firstname surname email role"
      );
      if (!faculty) throw new NotFoundError("Faculty not found");
      return faculty;
    }

    const faculties = await Faculty.find({}).populate(
      "admin",
      "firstname surname email role"
    );
    return faculties;
  }
}

module.exports = new AusaService();
