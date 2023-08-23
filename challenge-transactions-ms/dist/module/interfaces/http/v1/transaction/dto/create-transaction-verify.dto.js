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
exports.CreateTransactionVerifyDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTransactionVerifyDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: 'accountExternalIdDebit',
        type: 'string',
        required: true,
        description: 'Id',
        example: 'd5ae4c6e-7a27-4bea-89d1-58e8ee42a591',
    }),
    __metadata("design:type", String)
], CreateTransactionVerifyDto.prototype, "accountExternalIdDebit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUUID)(),
    (0, swagger_1.ApiProperty)({
        name: 'accountExternalIdCredit',
        type: 'string',
        required: true,
        description: 'Id',
        example: 'f47b07cf-9e4c-4c2d-85d7-8c7027c98ce5',
    }),
    __metadata("design:type", String)
], CreateTransactionVerifyDto.prototype, "accountExternalIdCredit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        name: 'transferTypeId',
        type: 'number',
        required: true,
        description: 'type transfer id',
        example: 1,
    }),
    __metadata("design:type", Number)
], CreateTransactionVerifyDto.prototype, "transferTypeId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        name: 'value',
        type: 'number',
        required: true,
        description: 'Value to be validate',
        example: 1000,
    }),
    __metadata("design:type", Number)
], CreateTransactionVerifyDto.prototype, "value", void 0);
exports.CreateTransactionVerifyDto = CreateTransactionVerifyDto;
//# sourceMappingURL=create-transaction-verify.dto.js.map