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
exports.TransactionVerifyController = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const create_transaction_verify_dto_1 = require("./dto/create-transaction-verify.dto");
const response_description_1 = require("../../../helpers/response.description");
const generic_error_1 = require("../../../helpers/generic-error");
const save_transaction_verify_event_command_1 = require("../../../../application/command/save-transaction-verify-event.command");
const response_transaction_verify_dto_1 = require("../../../../application/dto/response-transaction-verify.dto");
const microservices_1 = require("@nestjs/microservices");
const transaction_verify_request_dto_1 = require("./dto/transaction-verify-request.dto");
const update_transaction_verify_event_command_1 = require("../../../../application/command/update-transaction-verify-event.command");
const get_transaction_verify_by_id_dto_1 = require("./dto/get-transaction-verify-by-id.dto");
const get_transaction_verify_event_query_1 = require("../../../../application/query/get-transaction-verify-event.query");
let TransactionVerifyController = class TransactionVerifyController {
    constructor(logger, queryBus, commandBus) {
        this.logger = logger;
        this.queryBus = queryBus;
        this.commandBus = commandBus;
    }
    async getTransactionVerify(pathTransactionVerifyDto) {
        this.logger.log('Init Get Transaction Verify By Id ');
        const command = new get_transaction_verify_event_query_1.GetTransactionVerifyEventCommand(pathTransactionVerifyDto.transactionExternalId);
        return this.queryBus.execute(command);
    }
    async saveTransactionVerify(body) {
        this.logger.log('Init saveTransactionVerify');
        const command = new save_transaction_verify_event_command_1.SaveTransactionVerifyEventCommand(body);
        const result = await this.commandBus.execute(command);
        return result;
    }
    async handleEventUpdateStatusTransactionVerify(transactionVerifyRequestDto) {
        this.logger.log('Init handleEventUpdateTransaction');
        const command = new update_transaction_verify_event_command_1.UpdateTransactionVerifyEventCommand(transactionVerifyRequestDto);
        await this.commandBus.execute(command);
    }
};
__decorate([
    (0, common_1.Get)(':transactionExternalId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get transacion operation with transactionExternalId',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Trasnaction List Is Successful',
        type: response_transaction_verify_dto_1.TransactionVerifyResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.BAD_REQUEST,
    }),
    (0, swagger_1.ApiNotFoundResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.FEATURE_FLAG_NOT_FOUND,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.INTERNAL_SERVER_ERROR,
    }),
    (0, swagger_1.ApiGatewayTimeoutResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.API_GATEWAY_TIMEOUT,
    }),
    __param(0, (0, common_1.Param)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_transaction_verify_by_id_dto_1.GetTransactionVerifyDto]),
    __metadata("design:returntype", Promise)
], TransactionVerifyController.prototype, "getTransactionVerify", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Save new transactiion',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Transaction saved successfully',
        type: response_transaction_verify_dto_1.TransactionVerifyResponseDto,
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.BAD_REQUEST,
    }),
    (0, swagger_1.ApiInternalServerErrorResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.INTERNAL_SERVER_ERROR,
    }),
    (0, swagger_1.ApiGatewayTimeoutResponse)({
        type: generic_error_1.GenericError,
        description: response_description_1.ResponseDescription.API_GATEWAY_TIMEOUT,
    }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_verify_dto_1.CreateTransactionVerifyDto]),
    __metadata("design:returntype", Promise)
], TransactionVerifyController.prototype, "saveTransactionVerify", null);
__decorate([
    (0, microservices_1.MessagePattern)('transaction-verify-update-ms'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transaction_verify_request_dto_1.TransactionVerifyRequestDto]),
    __metadata("design:returntype", Promise)
], TransactionVerifyController.prototype, "handleEventUpdateStatusTransactionVerify", null);
TransactionVerifyController = __decorate([
    (0, swagger_1.ApiTags)('transaction-verify'),
    (0, common_1.Controller)('transaction-verify'),
    __metadata("design:paramtypes", [common_1.Logger,
        cqrs_1.QueryBus,
        cqrs_1.CommandBus])
], TransactionVerifyController);
exports.TransactionVerifyController = TransactionVerifyController;
//# sourceMappingURL=transaction-verify.controller.js.map