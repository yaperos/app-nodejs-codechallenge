"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'APPLICATION_ERROR';
        this.status = status !== null && status !== void 0 ? status : this.status;
    }
}
exports.ApplicationError = ApplicationError;
//# sourceMappingURL=app.error.js.map