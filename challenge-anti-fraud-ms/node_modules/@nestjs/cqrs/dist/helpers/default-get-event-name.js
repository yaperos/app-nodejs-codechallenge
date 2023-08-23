"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGetEventName = void 0;
const defaultGetEventName = (event) => {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name;
};
exports.defaultGetEventName = defaultGetEventName;
