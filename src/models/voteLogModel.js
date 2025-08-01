const { default: mongoose } = require("mongoose");

const voteLog = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  election: { type: ObjectId, ref: "Election" },
  candidate: { type: ObjectId, ref: "User" },
  votedAt: { type: Date, default: Date.now },
});

const VoteLog = mongoose.model("votelog", voteLog);
