"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = exports.TransactionStatus = void 0;
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus[TransactionStatus["Pending"] = 1] = "Pending";
    TransactionStatus[TransactionStatus["Approved"] = 2] = "Approved";
    TransactionStatus[TransactionStatus["Rejected"] = 3] = "Rejected";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var TransactionType;
(function (TransactionType) {
    TransactionType[TransactionType["Debit"] = 1] = "Debit";
    TransactionType[TransactionType["Credit"] = 2] = "Credit";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
