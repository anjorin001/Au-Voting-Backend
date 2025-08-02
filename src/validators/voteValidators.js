const Joi = require('joi');
const mongoose = require('mongoose');

const voteSchemaValidator = Joi.object({
  electionId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .messages({
      'any.required': 'Election ID is required',
      'any.invalid': 'Election ID must be a valid ObjectId',
    }),

  candidateId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation')
    .messages({
      'any.required': 'Candidate ID is required',
      'any.invalid': 'Candidate ID must be a valid ObjectId',
    }),
});


const electionResultSchema = Joi.object({
  electionId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "any.required": "electionId is required",
      "string.hex": "electionId must be a valid MongoDB ObjectId",
      "string.length": "electionId must be exactly 24 characters",
    }),
});


module.exports = {
  voteSchemaValidator,
  electionResultSchema
}