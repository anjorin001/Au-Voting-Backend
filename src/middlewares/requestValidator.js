const { sendError } = require("../util/baseResponse");

function validate(schema) {
  return (req, res, next) => {
    const merged = { ...req.body, ...req.params, ...req.query };

    const { error, value } = schema.validate(merged, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      return sendError(
        res,
        "Validation error",
        400,
        error.details.map((d) => d.message.replace(/['"]/g, ""))
      );
    }

    req.validated = value;
    next();
  };
}

module.exports = validate;
