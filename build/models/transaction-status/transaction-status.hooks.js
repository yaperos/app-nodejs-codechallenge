"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionsBuilder = void 0;
const conditionsBuilder = (conditions) => {
    const baseConditions = {};
    if (conditions.name) {
        baseConditions.name = conditions.name;
    }
    return baseConditions;
};
exports.conditionsBuilder = conditionsBuilder;
