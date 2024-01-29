const createError = require('http-errors');

const NOT_FOUND_CODE = 404;

module.exports.NotFoundErrorHandler = (req, res) => {
  res.status(NOT_FOUND_CODE).send(createError(NOT_FOUND_CODE));
};
