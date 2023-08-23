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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiFraudValidationInfrastructure = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const constants_1 = require("../../core/helpers/constants");
let AntiFraudValidationInfrastructure = class AntiFraudValidationInfrastructure {
    constructor(clientKafka, logger) {
        this.clientKafka = clientKafka;
        this.logger = logger;
    }
    async getVerifyTransaction(transaction) {
        const { transactionExternalId, value } = transaction;
        const status = value > constants_1.MinPassRate
            ? constants_1.TransactionStatusVerify.REJECTED
            : constants_1.TransactionStatusVerify.APPROVED;
        this.logger.log(`status to be updated is ${status} with value ${value}`);
        return this.clientKafka.emit(process.env.CLIENT_TRANSACTION_VERIFY_MS, JSON.stringify({ transactionExternalId, status }));
    }
};
AntiFraudValidationInfrastructure = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.ClientModuleRegister)),
    __metadata("design:paramtypes", [microservices_1.ClientKafka,
        common_1.Logger])
], AntiFraudValidationInfrastructure);
exports.AntiFraudValidationInfrastructure = AntiFraudValidationInfrastructure;
//# sourceMappingURL=anti-fraud-validation.infrastructure.js.map