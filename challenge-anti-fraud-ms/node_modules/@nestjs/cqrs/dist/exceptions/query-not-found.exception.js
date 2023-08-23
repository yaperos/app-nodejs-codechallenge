"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryHandlerNotFoundException = void 0;
class QueryHandlerNotFoundException extends Error {
    constructor(queryName) {
        super(`The query handler for the "${queryName}" query was not found!`);
    }
}
exports.QueryHandlerNotFoundException = QueryHandlerNotFoundException;
