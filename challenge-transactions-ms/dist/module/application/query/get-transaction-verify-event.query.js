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
exports.GetTransactionVerifyEventCommandHandler = exports.GetTransactionVerifyEventCommand = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const transacion_verify_infrastructure_1 = require("../../infrastructure/transacion-verify.infrastructure");
const save_transaction_verify_dto_1 = require("../dto/save-transaction-verify.dto");
const generic_response_1 = require("../../../core/helpers/generic-response");
class GetTransactionVerifyEventCommand {
    constructor(transactionExternalId) {
        this.transactionExternalId = transactionExternalId;
    }
}
exports.GetTransactionVerifyEventCommand = GetTransactionVerifyEventCommand;
let GetTransactionVerifyEventCommandHandler = class GetTransactionVerifyEventCommandHandler {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(command) {
        try {
            const { transactionExternalId } = command;
            const transactionVerifyResult = await this.repository.findTransactionVerifyById(transactionExternalId);
            const response = save_transaction_verify_dto_1.SaveTransactionVerifyDto.fromDomainToResponse(transactionVerifyResult);
            return new generic_response_1.TransactionGenericApiResponse(response);
        }
        catch (error) {
            throw new common_1.NotFoundException(common_1.HttpException.createBody(error.message, error.name, error.status), error.status);
        }
    }
};
GetTransactionVerifyEventCommandHandler = __decorate([
    (0, cqrs_1.QueryHandler)(GetTransactionVerifyEventCommand),
    __param(0, (0, common_1.Inject)(transacion_verify_infrastructure_1.TransactionVerifyInfrastructure)),
    __metadata("design:paramtypes", [Object])
], GetTransactionVerifyEventCommandHandler);
exports.GetTransactionVerifyEventCommandHandler = GetTransactionVerifyEventCommandHandler;
//# sourceMappingURL=get-transaction-verify-event.query.js.map