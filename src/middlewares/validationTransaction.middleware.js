const { body, validationResult } = require("express-validator");
const { TYPE_TRANSACTION } = require("../models/enums/statusTransaction.enum");

const validateTransaction = [
  body("accountExternalIdDebit")
    .isUUID()
    .withMessage("Account external ID debit must be a UUID")
    .notEmpty()
    .withMessage("Account external ID debit must be not empty"),
  body("accountExternalIdCredit")
    .isUUID()
    .withMessage("Account external ID credit must be a UUID")
    .notEmpty()
    .withMessage("Account external ID credit must be not empty"),
  body("tranferTypeId")
    .isInt()
    .withMessage("Transfer type ID must be a number")
    .custom((value) => {
      if (!TYPE_TRANSACTION[value]) {
        throw new Error("Transfer type ID must be a number between 1 and 3");
      }
      return true;
    }),
  body("value").isInt().withMessage("value must be a number"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const extractedErrors = [];
      errors.array().map((err) => {
        extractedErrors.push({ [err.path]: err.msg, value: err.value });
      });
      return res.status(400).json({ errors: extractedErrors });
    }

    next();
  },
];

module.exports = validateTransaction;
