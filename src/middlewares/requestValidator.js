const { ErrorResponse } = require("../util/baseResponse");

function validate(schema) {
  return (req, res, next) => {
    const merged = { ...req.body, ...req.params, ...req.query };

    const { error, value } = schema.validate(merged, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return new ErrorResponse(res, 400, "Validation error", {
        errors: error.details.map((d) => d.message.replace(/['"]/g, "")),
      }).send();
    }

    req.validated = value;
    next();
  };
}

module.exports = validate;
