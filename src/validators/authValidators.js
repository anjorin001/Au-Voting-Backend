const Joi = require("joi");

const signupValidator = Joi.object({
  firstname: Joi.string()
    .trim()
    .pattern(/^[^\s]+$/, { name: "no spaces" })
    .label("First name")
    .messages({
      "string.pattern.name": "{{#label}} must not contain spaces",
    }),
  surname: Joi.string()
    .trim()
    .pattern(/^[^\s]+$/, { name: "no spaces" })
    .label("Last name")
    .messages({
      "string.pattern.name": "{{#label}} must not contain spaces",
    }),
  email: Joi.string().email().label("Email"),
  matricNo: Joi.string().required().label("Matriculation Number"),
  newPassword: Joi.string()
    .min(6)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"
      )
    )
    .required()
    .label("New password"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.email": "Please provide a valid {#label}.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.pattern.base": "{#label} must be between 8 and 12 digits.",
    "any.required": "{#label} is required.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
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
