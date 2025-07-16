
const Joi = require("joi");
const { availableFaculties } = require("../helper/facultys");

const updateProfileValidator = Joi.object({
  firstname: Joi.string().min(2).max(50).label("First name"),
  surname: Joi.string().min(2).max(50).label("Last name"),
  email: Joi.string().email().label("Email"),
  faculty: Joi.string().valid(...availableFaculties).label("Faculty"),
  bio: Joi.string().max(500).label("Bio"),
})
  .min(1) // At least one field must be provided
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.email": "Please provide a valid {#label}.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.max": "{#label} must not exceed {#limit} characters.",
    "any.only": "{#label} must be one of the available faculties.",
    "object.min": "At least one field must be provided for update.",
  });

const updatePasswordValidator = Joi.object({
  currentPassword: Joi.string().required().label("Current password"),
  newPassword: Joi.string().min(6).max(128).required().label("New password"),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .label("Confirm password"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.max": "{#label} must not exceed {#limit} characters.",
    "any.only": "{#label} must match the new password.",
    "any.required": "{#label} is required.",
  });

const userIdParamValidator = Joi.object({
  userId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .label("User ID"),
})
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.pattern.base": "{#label} must be a valid MongoDB ObjectId.",
    "any.required": "{#label} is required.",
  });

module.exports = {
  updateProfileValidator,
  updatePasswordValidator,
  userIdParamValidator,
};

