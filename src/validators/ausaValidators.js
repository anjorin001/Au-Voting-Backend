const Joi = require("joi");
const { availableFaculties } = require("../helper/facultys");

const globalElectionsQueryValidator = Joi.object({
  status: Joi.string()
    .valid("upcoming", "ongoing", "ended")
    .optional()
    .label("Election Status"),
}).messages({
  "string.base": "{#label} must be a text.",
  "any.only": "{#label} must be one of: upcoming, ongoing, ended.",
});

const facultyElectionsQueryValidator = Joi.object({
  facultyName: Joi.string()
    .valid(...availableFaculties)
    .optional()
    .label("Faculty"),
}).messages({
  "string.base": "{#label} must be a text.",
  "any.only": "{#label} must be one of the available faculties.",
});

const electionIdParamValidator = Joi.object({
  electionId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .label("Election ID"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.pattern.base": "{#label} must be a valid MongoDB ObjectId.",
    "any.required": "{#label} is required.",
  });

const createGlobalElectionValidator = Joi.object({
  title: Joi.string().min(5).max(200).required().label("Election Title"),

  general: Joi.boolean().default(true).label("General Election"),

  faculty: Joi.when("general", {
    is: false,
    then: Joi.string()
      .valid(...availableFaculties)
      .required(),
    otherwise: Joi.forbidden(),
  }).label("Faculty"),

  candidates: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(2)
    .unique()
    .required()
    .label("Candidates"),

  startTime: Joi.date().min("now").required().label("Start Time"),

  endTime: Joi.date()
    .greater(Joi.ref("startTime"))
    .required()
    .label("End Time"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.min": "{#label} must be at least {#limit} characters.",
    "string.max": "{#label} must not exceed {#limit} characters.",
    "string.pattern.base": "{#label} must be a valid MongoDB ObjectId.",
    "boolean.base": "{#label} must be a boolean value.",
    "array.base": "{#label} must be an array.",
    "array.min": "{#label} must have at least {#limit} items.",
    "array.unique": "{#label} must contain unique values.",
    "date.base": "{#label} must be a valid date.",
    "date.min": "{#label} must be in the future.",
    "date.greater": "{#label} must be after the start time.",
    "any.required": "{#label} is required.",
    "any.only": "{#label} must be one of the available options.",
    "any.forbidden":
      "{#label} is not allowed when creating a general election.",
  });

const globalCandidatesQueryValidator = Joi.object({
  facultyName: Joi.string()
    .valid(...availableFaculties)
    .optional()
    .label("Faculty"),

  matricNo: Joi.string()
    .pattern(/^\d{2}\/\d{4}$/)
    .required()
    .label("Matriculation Number")
    .messages({}),
}).messages({
  "string.base": "{#label} must be a text.",
  "string.pattern.base":
    '"Matriculation Number" must follow the format NN/YYYY (e.g. 22/0317)',
  "any.only": "{#label} must be one of the available faculties.",
});

const facultyManagementValidator = Joi.object({
  facultyId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .label("Faculty ID"),

  adminId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .label("Admin ID"),

  action: Joi.string().valid("add", "remove").required().label("Action"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.pattern.base": "{#label} must be a valid MongoDB ObjectId.",
    "any.only": "{#label} must be either 'add' or 'remove'.",
    "any.required": "{#label} is required.",
  });

const paginationValidator = Joi.object({
  page: Joi.number().integer().min(1).default(1).label("Page Number"),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .label("Items Per Page"),

  sortBy: Joi.string()
    .valid("createdAt", "title", "status", "startTime", "endTime")
    .default("createdAt")
    .label("Sort Field"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc")
    .label("Sort Order"),
}).messages({
  "number.base": "{#label} must be a number.",
  "number.integer": "{#label} must be an integer.",
  "number.min": "{#label} must be at least {#limit}.",
  "number.max": "{#label} must not exceed {#limit}.",
  "any.only": "{#label} must be one of the allowed values.",
});

const facultyAdminQueryValidator = Joi.object({
  facultyName: Joi.string()
    .valid(...availableFaculties)
    .required()
    .label("Faculty Name"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "any.only": "{#label} must be one of the available faculties.",
    "any.required": "{#label} is required.",
  });

const removeFacultyAdminValidator = Joi.object({
  matricNo: Joi.string()
    .pattern(/^[A-Z]{2,3}\/\d{4}\/\d{3,4}$/)
    .required()
    .label("Matriculation Number"),

  facultyName: Joi.string()
    .valid(...availableFaculties)
    .required()
    .label("Faculty Name"),
})
  .prefs({ presence: "required" })
  .messages({
    "string.base": "{#label} must be a text.",
    "string.empty": "{#label} cannot be empty.",
    "string.pattern.base": "{#label} must be in the format XX/YYYY/XXX.",
    "any.only": "{#label} must be one of the available faculties.",
    "any.required": "{#label} is required.",
  });

const getFacultiesQueryValidator = Joi.object({
  facultyId: Joi.string()
    .optional()
    .messages({
      'string.base': 'facultyId must be a string',
    }),
});



module.exports = {
  globalElectionsQueryValidator,
  facultyElectionsQueryValidator,
  electionIdParamValidator,
  createGlobalElectionValidator,
  globalCandidatesQueryValidator,
  facultyManagementValidator,
  paginationValidator,
  facultyAdminQueryValidator,
  removeFacultyAdminValidator,
  getFacultiesQueryValidator
};
