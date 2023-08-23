"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionTypes = exports.ClientModuleRegister = void 0;
exports.ClientModuleRegister = 'KAFKA_TRANSACTION_EMITTER_MS';
var TransactionTypes;
(function (TransactionTypes) {
    TransactionTypes[TransactionTypes["deposit"] = 1] = "deposit";
    TransactionTypes[TransactionTypes["transfer"] = 2] = "transfer";
})(TransactionTypes = exports.TransactionTypes || (exports.TransactionTypes = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["PENDING"] = 1] = "PENDING";
    TransactionStatus[TransactionStatus["APPROVED"] = 2] = "APPROVED";
    TransactionStatus[TransactionStatus["REJECTED"] = 3] = "REJECTED";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
//# sourceMappingURL=constants.js.map