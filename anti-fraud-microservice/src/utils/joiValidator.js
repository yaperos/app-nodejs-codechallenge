const joiOptions = {
  convert: true,
  allowUnknown: false,
  abortEarly: false,
}

const validator = schema => values => {
  const { value, error } = schema.validate(values, joiOptions)
  if (error === undefined) {
    return value
  }
  throw error
}

module.exports = validator
