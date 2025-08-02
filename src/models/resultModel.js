import mongoose, { model, Schema, Types } from "mongoose";

const ResultSchema = new Schema(
  {
    election: { type: Types.ObjectId, ref: "Election", required: true },
    votes: [
      {
        candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        vote: { type: Number, default: 0 },
      },
    ],
  },
  { strict: false }
);

export const Result = model("Result", ResultSchema);
