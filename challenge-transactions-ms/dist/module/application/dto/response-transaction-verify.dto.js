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
exports.TransactionVerifyResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class TransactionType {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'deposit', type: 'string' }),
    __metadata("design:type", String)
], TransactionType.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', type: 'number' }),
    __metadata("design:type", Number)
], TransactionType.prototype, "id", void 0);
class TransactionStatus {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'PENDING', type: 'string' }),
    __metadata("design:type", String)
], TransactionStatus.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1', type: 'number' }),
    __metadata("design:type", Number)
], TransactionStatus.prototype, "id", void 0);
class ResponseTransactionVerify {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'fff529b4-d459-4d05-bc8f-d6a4852e276d',
        type: 'string',
    }),
    __metadata("design:type", String)
], ResponseTransactionVerify.prototype, "transactionExternalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
        type: 'string',
    }),
    __metadata("design:type", String)
], ResponseTransactionVerify.prototype, "accountExternalIdDebit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
        type: 'string',
    }),
    __metadata("design:type", String)
], ResponseTransactionVerify.prototype, "accountExternalIdCredit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '120', type: 'number' }),
    __metadata("design:type", Number)
], ResponseTransactionVerify.prototype, "value", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => TransactionType),
    (0, swagger_1.ApiProperty)({ type: TransactionType }),
    __metadata("design:type", TransactionType)
], ResponseTransactionVerify.prototype, "transactionType", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => TransactionStatus),
    (0, swagger_1.ApiProperty)({ type: TransactionStatus }),
    __metadata("design:type", TransactionStatus)
], ResponseTransactionVerify.prototype, "transactionStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-08-21T13:44:49.942Z', type: 'string' }),
    __metadata("design:type", String)
], ResponseTransactionVerify.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-08-21T13:44:49.942Z', type: 'string' }),
    __metadata("design:type", String)
], ResponseTransactionVerify.prototype, "updatedAtStatus", void 0);
class TransactionVerifyResponseDto {
}
__decorate([
    (0, class_transformer_1.Type)(() => ResponseTransactionVerify),
    (0, swagger_1.ApiProperty)({ type: ResponseTransactionVerify, isArray: false }),
    __metadata("design:type", ResponseTransactionVerify)
], TransactionVerifyResponseDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', example: 'Success' }),
    __metadata("design:type", String)
], TransactionVerifyResponseDto.prototype, "message", void 0);
exports.TransactionVerifyResponseDto = TransactionVerifyResponseDto;
//# sourceMappingURL=response-transaction-verify.dto.js.map