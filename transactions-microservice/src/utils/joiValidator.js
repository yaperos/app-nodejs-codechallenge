const expressJoiValidation = require('express-joi-validation')

const joiOptions = {
  convert: true,
  allowUnknown: false,
  abortEarly: false,
}

const simpleValidator = schema => values => {
  const { value, error } = schema.validate(values, joiOptions)
  if (error === undefined) {
    return value
  }
  throw error
}

const expressValidator = expressJoiValidation.createValidator({
  passError: true,
})

module.exports = {
  expressValidator,
  simpleValidator,
}
