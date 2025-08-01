import { Schema, model, Types } from 'mongoose';

const ResultSchema = new Schema({
  election: { type: Types.ObjectId, ref: 'Election', required: true },
  candidate: { type: Types.ObjectId, ref: 'User', required: true },
  votes: { type: Number, default: 0 }
});

export const Result = model('Result', ResultSchema);
