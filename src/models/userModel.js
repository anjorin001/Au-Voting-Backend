const mongoose = require("mongoose");
const { availableFaculties } = require("../helper/facultys");

const userSchema = new mongoose.Schema(
  {
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
      default: null,
    },

    department: {
      type: String,
      default: null,
    }, // TODO work on department field -- to respect faculty (csc only in fos)

    password: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: null,
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

    // TODO participatedElection not neeede here --votelog

    Active: {
      type: Boolean,
      default: true,
    },

    deleted: {
      type: Boolean,
      default: false, //TODO make sure all get users request is deleted flase
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
