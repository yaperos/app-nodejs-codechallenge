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
exports.AntiFraudValidationController = void 0;
const common_1 = require("@nestjs/common");
const transaction_verify_dto_1 = require("./dto/transaction-verify.dto");
const microservices_1 = require("@nestjs/microservices");
const anti_fraud_validation_command_1 = require("../../../application/command/anti-fraud-validation.command");
const cqrs_1 = require("@nestjs/cqrs");
let AntiFraudValidationController = class AntiFraudValidationController {
    constructor(logger, commandBus) {
        this.logger = logger;
        this.commandBus = commandBus;
    }
    async handleEventValidateTransaction(transactionVerify) {
        this.logger.log('Init handleEventVerifyTransaction');
        const command = new anti_fraud_validation_command_1.GetAntiFraudValidationEventCommand(transactionVerify.transactionExternalId, transactionVerify.value);
        await this.commandBus.execute(command);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('transaction-verify-ms'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_verify_dto_1.TransactionVerifyDto]),
    __metadata("design:returntype", Promise)
], AntiFraudValidationController.prototype, "handleEventValidateTransaction", null);
AntiFraudValidationController = __decorate([
    (0, common_1.Controller)('anti-fraud-validation'),
    __metadata("design:paramtypes", [common_1.Logger,
        cqrs_1.CommandBus])
], AntiFraudValidationController);
exports.AntiFraudValidationController = AntiFraudValidationController;
//# sourceMappingURL=anti-fraud-validation.controller.js.map