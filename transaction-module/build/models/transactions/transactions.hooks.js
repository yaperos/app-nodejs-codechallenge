"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionsBuilder = void 0;
const conditionsBuilder = (conditions) => {
    const baseConditions = {};
    if (conditions.transactionExternalId) {
        baseConditions.transactionExternalId = conditions.transactionExternalId;
    }
    if (conditions.transactionType) {
        baseConditions.transactionType = conditions.transactionType;
    }
    if (conditions.transactionStatus) {
        baseConditions.transactionStatus = conditions.transactionStatus;
    }
    if (conditions.value) {
        baseConditions.value = conditions.value;
    }
    if (conditions.createdAt) {
        baseConditions.createdAt = conditions.createdAt;
    }
    return baseConditions;
};
exports.conditionsBuilder = conditionsBuilder;
