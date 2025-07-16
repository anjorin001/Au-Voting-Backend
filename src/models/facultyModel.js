const mongoose = require("mongoose");
const { availableFaculties } = require("../helper/facultys");

const facultySchema = new mongoose.Schema({
    name: {
      type: String,
      enum: availableFaculties,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],

    facultyElections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "election",
      }
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Custom validation: max 2 admins
facultySchema.path("admins").validate(function (value) {
  return value.length <= 2;
}, "A faculty must have no more than 2 administrators.");

const Faculty = mongoose.model("faculty", facultySchema);
module.exports = Faculty;
