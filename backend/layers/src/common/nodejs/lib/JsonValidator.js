"use strict";

const Validator = require("jsonschema").Validator;

const formatErrors = (errors) => {
    let errorsFormatted = [];

    for (let index = 0; index < errors.length; index++) {
        const error = errors[index];

        errorsFormatted.push({
            message: error.stack,
        });
    }

    return errorsFormatted;
};

class JsonValidator {
    static validate(data, schema) {
        const validator = new Validator();
        const validationResult = validator.validate(data, schema);

        return {
            valid: validationResult.valid,
            errors: formatErrors(validationResult.errors),
        };
    }
}

module.exports = JsonValidator;
