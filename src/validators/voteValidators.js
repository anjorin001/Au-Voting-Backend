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

module.exports = {
    voteSchemaValidator
}