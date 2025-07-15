const Joi = require("joi");

const signupValidator = Joi.object({
  firstname: Joi.string().label("First name"),
  surname: Joi.string().label("Last name"),
  email: Joi.string().email().label("Email"),
  matricNo: Joi.string().required().label("Matriculation Number"),
  password: Joi.string().min(6).label("Password"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.email": "Please provide a valid {#label}.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.pattern.base": "{#label} must be between 8 and 12 digits.",
    "any.required": "{#label} is required.",
  });


  
const loginValidator = Joi.object({
  identifier: Joi.string().required().label("Email or Matric Number"),
  password: Joi.string().label("Password"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.email": "Please provide a valid {#label}.",
    "any.required": "{#label} is required.",
  });

module.exports = {
  signupValidator,
  loginValidator,
};
