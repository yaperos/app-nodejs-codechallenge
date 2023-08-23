"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandlerNotFoundException = void 0;
class CommandHandlerNotFoundException extends Error {
    constructor(commandName) {
        super(`The command handler for the "${commandName}" command was not found!`);
    }
}
exports.CommandHandlerNotFoundException = CommandHandlerNotFoundException;
