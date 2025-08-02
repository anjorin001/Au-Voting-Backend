import mongoose, { model, Types } from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    election: { type: Types.ObjectId, ref: "Election", required: true },
    votes: [
      {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        vote: { type: Number, default: 0 },
      },
    ],
  },
  { strict: false }
);

export const Result = model("Result", ResultSchema);
