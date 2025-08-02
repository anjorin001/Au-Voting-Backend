const { NotFoundError, UnauthorizedError } = require("../exceptions/baseError");
const validateCandidate = require("../helper/candidateChecker");
const Election = require("../models/electionModel");
const Faculty = require("../models/facultyModel");
const User = require("../models/userModel");
const verifiedUser = require("../util/VerifyChecker");

class AusaService {
  async ausaMetrics() {
    try {
      const [
        activeUsers,
        verifiedUsers,
        ongoingElections,
        previousElections,
        upcomingElections,
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
        ongoingElections,
        previousElections,
        upcomingElections,
      };
    } catch (error) {
      throw new Error("Failed to fetch AUSA metrics");
    }
  }

  async globalElections({ status = null } = {}) {
    //TODO use this for normal user get elections
    const filter = { general: true };
    if (status) filter.status = status; // TODO 6. Add Input Validation in validator for status .. and other endpotn that requires it

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
      .populate("candidates", "firstname surname")
      .populate({
        path: "result",
        populate: {
          path: "candidate",
          select: "firstname surname",
        },
      });

    if (!election) throw new NotFoundError("Election not found");

    if (!election.general)
      throw new ValidationError("This is not a global election");

    return election;
  }

  async facultyElections({ facultyName = null } = {}) {
    const filter = { general: false };
    if (facultyName) filter.name = facultyName; // TODO Add Faculty Validation in validator

    const facultyElections = await Election.find(filter) // TODO add stauts filter for election ongoing etc
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

  async createGlbElection(electData, createdBy) {
    const { title, general, faculty, candidates } =
      electData; //TODO add start and ed ddate back when done with testing

    const candidatesValid = await validateCandidate(candidates);

    const now = new Date();
    const startTime = new Date(now.getTime() + 2 * 60 * 1000); // 2 mins from now
    const endTime = new Date(now.getTime() + 6 * 60 * 1000); // 5 mins from now

    if (candidatesValid) {
      const newElection = await Election.create({
        title,
        general,
        faculty,
        candidates,
        startTime,
        showLiveResults,
        endTime,
        createdBy,
      });

      return { election: newElection };
    }
  }

  async getGlbCandidates({ facultyName = null, matricNo = null } = {}) {
    const filter = { deleted: false };
    if (facultyName) filter.faculty = facultyName;
    if (matricNo) filter.matricNo = matricNo;

    const candidates = await User.find(filter)
      .select("-participatedElection -createdAt -role -password")
      .sort({ createdAt: -1 });

    return candidates;
  }

  async getFaculties({ facultyId = null } = {}) {
    //TODO  get facultyID not fetching based on id
    console.log("faculty id", facultyId);
    const filter = {};
    if (facultyId) filter._id = facultyId;

    const faculties = await Faculty.find(filter).populate(
      "admins",
      "firstname surname email role"
    );
    return faculties;
  }

  async getuserToPromote(matricNo, facultyName) {
    const user = await User.findOne({
      matricNo,
      faculty: facultyName,
      deleted: false,
    }).select("verified firstname surname matricNo");

    if (!user) throw new NotFoundError("user not found");
    return user;
  }

  async addFacultyAdmin(matricNo, facultyName) {
    const user = await User.findOne({
      matricNo,
      faculty: facultyName,
      deleted: false,
    }).select("firstname surname matricNo");
    if (!user) throw new NotFoundError("user not found");

    const verifed = await verifiedUser(user);
    if (!verifed) throw new UnauthorizedError("user not verified");

    user.role = "admin";
    await user.save();

    const faculty = await Faculty.findOne({ name: facultyName });
    faculty.admins.push(user._id);

    await faculty.save();
    // TODO send email to user email regarding role onboarding

    const plainUser = user.toObject();
    const { password, participatedElection, bio, ...addedUser } = plainUser; //TODO modify participatedElection to votlog

    return addedUser;
  }

  async getFacultyAdmin(facultyName) {
    const facultyAdmin = await Faculty.findOne({ name: facultyName }).populate(
      "admins",
      "firstname surname matricNo faculty"
    );
    if (!facultyAdmin) throw new NotFoundError("faculty not found");

    return facultyAdmin;
  }

  async removeFacultyAdmin(matricNo, facultyName) {
    const user = await User.findOne({
      matricNo,
      faculty: facultyName,
      deleted: false,
    });

    if (!user) throw new NotFoundError("User not found");

    user.role = "user";
    await user.save();

    const faculty = await Faculty.findOne({ name: facultyName });

    if (!faculty) throw new NotFoundError("Faculty not found");

    faculty.admins = faculty.admins.filter(
      (adminId) => adminId.toString() !== user._id.toString()
    );

    await faculty.save();

    const plainUser = user.toObject();
    const { password, participatedElection, bio, ...removedUser } = plainUser;

    return removedUser;
  }
}

module.exports = new AusaService();
