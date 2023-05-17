"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(transactionInfo) {
        this.observers = [];
        this.accountExternalIdDebit = transactionInfo.accountExternalIdDebit;
        this.accountExternalIdCredit = transactionInfo.accountExternalIdCredit;
        this.tranferTypeId = transactionInfo.tranferTypeId;
        this.value = transactionInfo.value;
        this.transactionExternalId = transactionInfo.transactionExternalId;
        this.transactionType = transactionInfo.transactionType;
        this.transactionStatus = transactionInfo.transactionStatus;
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }
    getStatus() {
        return this.transactionStatus;
    }
    setStatus(status) {
        this.transactionStatus = status;
        this.notify();
    }
    notify() {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.service.entity.js.map