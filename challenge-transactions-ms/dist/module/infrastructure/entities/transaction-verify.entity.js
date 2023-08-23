"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionVerifyEntity = void 0;
const typeorm_1 = require("typeorm");
const transaction_verify_type_entity_1 = require("./transaction-verify-type.entity");
const transaction_verify_status_entity_1 = require("./transaction-verify-status.entity");
let TransactionVerifyEntity = class TransactionVerifyEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransactionVerifyEntity.prototype, "transactionExternalId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], TransactionVerifyEntity.prototype, "accountExternalIdDebit", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], TransactionVerifyEntity.prototype, "accountExternalIdCredit", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_verify_type_entity_1.TransactionVerifyTypeEntity, { eager: true, cascade: true }),
    __metadata("design:type", transaction_verify_type_entity_1.TransactionVerifyTypeEntity)
], TransactionVerifyEntity.prototype, "transactionType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_verify_status_entity_1.TransactionVerifyStatusEntity, {
        eager: true,
        cascade: true,
    }),
    __metadata("design:type", transaction_verify_status_entity_1.TransactionVerifyStatusEntity)
], TransactionVerifyEntity.prototype, "transactionStatus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TransactionVerifyEntity.prototype, "value", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TransactionVerifyEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TransactionVerifyEntity.prototype, "updatedAtStatus", void 0);
TransactionVerifyEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'transactionsVerify' })
], TransactionVerifyEntity);
exports.TransactionVerifyEntity = TransactionVerifyEntity;
//# sourceMappingURL=transaction-verify.entity.js.map