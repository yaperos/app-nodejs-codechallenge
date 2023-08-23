"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidSagaException = void 0;
class InvalidSagaException extends Error {
    constructor() {
        super(`Invalid saga exception. Each saga should return an Observable object`);
    }
}
exports.InvalidSagaException = InvalidSagaException;
