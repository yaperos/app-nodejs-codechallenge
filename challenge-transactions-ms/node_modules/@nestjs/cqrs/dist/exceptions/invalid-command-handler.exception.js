"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCommandHandlerException = void 0;
class InvalidCommandHandlerException extends Error {
    constructor() {
        super(`Invalid command handler exception (missing @CommandHandler() decorator?)`);
    }
}
exports.InvalidCommandHandlerException = InvalidCommandHandlerException;
