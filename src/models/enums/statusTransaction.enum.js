const STATUS_TRANSACTION = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const TYPE_TRANSACTION = {
  1: "CREATED",
  2: "UPDATE_TO_APPROVE",
  3: "UPDATE_TO_REJECT",
};

module.exports = { STATUS_TRANSACTION, TYPE_TRANSACTION };
