const { default: mongoose } = require("mongoose");

const voteLog = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  election: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  votedAt: { type: Date, default: Date.now },
});

const VoteLog = mongoose.model("votelog", voteLog);

module.exports = VoteLog;
