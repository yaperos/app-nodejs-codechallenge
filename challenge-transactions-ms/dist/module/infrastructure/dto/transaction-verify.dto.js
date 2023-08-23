"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionVerifyDto = void 0;
const transaction_verify_entity_1 = require("../entities/transaction-verify.entity");
const constants_1 = require("../../../core/helpers/constants");
const transaction_verify_1 = require("../../domain/aggregates/transaction-verify");
class TransactionVerifyDto {
    static fromDomainToEntity(transactionVerifyRequest) {
        const transactionVerifyEntity = new transaction_verify_entity_1.TransactionVerifyEntity();
        transactionVerifyEntity.accountExternalIdCredit =
            transactionVerifyRequest.accountExternalIdCredit;
        transactionVerifyEntity.accountExternalIdDebit =
            transactionVerifyRequest.accountExternalIdDebit;
        transactionVerifyEntity.transactionType = {
            id: transactionVerifyRequest.transferTypeId,
            name: constants_1.TransactionTypes[transactionVerifyRequest.transferTypeId],
        };
        transactionVerifyEntity.transactionStatus = {
            id: 1,
            name: constants_1.TransactionStatus[1],
        };
        transactionVerifyEntity.value = transactionVerifyRequest.value;
        return transactionVerifyEntity;
    }
    static fromDataToDomain(transactionVerifySaved) {
        const transactionVeritySavedType = new transaction_verify_1.TransactionVerifyType(transactionVerifySaved.transactionType.id, transactionVerifySaved.transactionType.name);
        const transactionVerifySavedStatus = new transaction_verify_1.TransactionVerifyStatus(transactionVerifySaved.transactionStatus.id, transactionVerifySaved.transactionStatus.name);
        return new transaction_verify_1.TransactionVerify(transactionVerifySaved.transactionExternalId, transactionVerifySaved.accountExternalIdDebit, transactionVerifySaved.accountExternalIdCredit, transactionVeritySavedType, transactionVerifySaved.value, transactionVerifySavedStatus, transactionVerifySaved.createdAt, transactionVerifySaved.updatedAtStatus);
    }
}
exports.TransactionVerifyDto = TransactionVerifyDto;
//# sourceMappingURL=transaction-verify.dto.js.map