const mongoose = require("mongoose");
const { availableFaculties } = require("../helper/facultys");

const electionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["upcoming", "ongoing", "ended"],
    default: "upcoming",
  },

  general: {
    type: Boolean,
    default: false,
  },
  // TODO understand ow this is dynamuc
  faculty: {
    type: String,
    enum: availableFaculties,
    default: null,
    validate: {
      validator: function (value) {
        if (this.general === true) {
          return value === null;
        }
        if (this.general === false) {
          return value !== null && value !== "";
        }
        return true; // fallback for undefined `general`
      },
      message:
        "General elections cannot have a faculty; faculty elections must specify a faculty.",
    },
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },

  candidates: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    validate: {
      validator: function (candidates) {
        return candidates.length >= 2;
      },
      message: "An election must have at least 2 candidates.",
    },
    required: true,
  },

  startTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > new Date(Date.now() + 5 * 60 * 1000); // 5 min in future
      },
      message: "Election must start at least 5 minutes from now.",
    },
  },

  // TODO result of the election?

  endTime: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return this.startTime && value > this.startTime;
      },
      message: "End time must be after start time.",
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Election = mongoose.model("election", electionSchema);

module.exports = Election;
