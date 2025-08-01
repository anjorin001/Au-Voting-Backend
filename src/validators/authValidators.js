const Joi = require("joi");
const { availableFaculties } = require("../helper/facultys");

const signupValidator = Joi.object({
  firstname: Joi.string()
    .trim()
    .pattern(/^[^\s]+$/, { name: "noSpaces" })
    .label("First name")
    .messages({
      "string.pattern.name": "{{#label}} must not contain spaces",
    }),

  surname: Joi.string()
    .trim()
    .pattern(/^[^\s]+$/, { name: "noSpaces" })
    .label("Last name")
    .messages({
      "string.pattern.name": "{{#label}} must not contain spaces",
    }),

  email: Joi.string().email().label("Email"),

  faculty: Joi.string()
    .valid(...availableFaculties)
    .optional()
    .label("Faculty"),
  //TODO work on department validation ... aslo to refrence faculty department
  matricNo: Joi.string()
    .pattern(/^\d{2}\/\d{4}$/)
    .required()
    .label("Matriculation Number")
    .messages({
      "string.pattern.base":
        '"Matriculation Number" must follow the format NN/YYYY (e.g. 22/0317)',
    }),

  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"
      )
    )
    .required()
    .label("Password")
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    }),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.email": "Please provide a valid {#label}.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.max": "{#label} must be at most {#limit} characters.",
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
