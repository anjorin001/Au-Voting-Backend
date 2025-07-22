const mongoose = require("mongoose");
const { availableFaculties } = require("../helper/facultys");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },

  surname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  matricNo: {
    type: String,
    required: true,
    unique: true,
  },

  faculty: {
    type: String,
    enum: availableFaculties,
  },

  password: {
    type: String,
    required: true,
  },

  bio: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "admin", "super-admin"],
    default: "user",
  },

  verified: {
    type: Boolean,
    default: false,
  },

  participatedElection: [
    {
      electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "election",
        required: true,
      },
      voted: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    },
  ],

  Active: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
