"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionsBuilder = void 0;
const conditionsBuilder = (conditions) => {
    const baseConditions = {};
    if (conditions.transaction_id) {
        baseConditions.transaction_id = conditions.transaction_id;
    }
    if (conditions.transferTypeId) {
        baseConditions.transferTypeId = conditions.transferTypeId;
    }
    if (conditions.transaction_status_id) {
        baseConditions.transaction_status_id = conditions.transaction_status_id;
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
