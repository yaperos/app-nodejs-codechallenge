"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionVerifyStatus = exports.TransactionVerifyType = exports.TransactionVerify = void 0;
class TransactionVerify {
    constructor(transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, transactionType, value, transactionStatus, createdAt, updatedAtStatus) {
        this.transactionExternalId = transactionExternalId;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transactionType = transactionType;
        this.value = value;
        this.transactionStatus = transactionStatus;
        this.createdAt = createdAt;
        this.updatedAtStatus = updatedAtStatus;
    }
}
exports.TransactionVerify = TransactionVerify;
class TransactionVerifyType {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.TransactionVerifyType = TransactionVerifyType;
class TransactionVerifyStatus {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.TransactionVerifyStatus = TransactionVerifyStatus;
//# sourceMappingURL=transaction-verify.js.map