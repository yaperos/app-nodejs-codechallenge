"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionGenericApiResponse = void 0;
class TransactionGenericApiResponse {
    constructor(data = null, message = 'success', statusCode) {
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
        this.message = this.data === null ? 'empty' : 'success';
    }
}
exports.TransactionGenericApiResponse = TransactionGenericApiResponse;
//# sourceMappingURL=generic-response.js.map