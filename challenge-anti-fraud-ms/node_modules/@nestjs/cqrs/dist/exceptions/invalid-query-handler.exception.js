"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidQueryHandlerException = void 0;
class InvalidQueryHandlerException extends Error {
    constructor() {
        super(`Invalid query handler exception (missing @QueryHandler() decorator?)`);
    }
}
exports.InvalidQueryHandlerException = InvalidQueryHandlerException;
