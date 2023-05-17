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
exports.TransactionResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const transaction_service_1 = require("./transaction.service");
const transaction_entity_1 = require("./entities/transaction.entity");
const create_transaction_input_1 = require("./dto/create-transaction.input");
const datadog_1 = require("../datadog");
let TransactionResolver = class TransactionResolver {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    createTransaction(createTransactionInput) {
        return this.transactionService.create(createTransactionInput);
    }
    async findById(transactionId) {
        datadog_1.logger.log('info', {
            message: 'get transactions by id',
            transactionId,
        });
        const result = await this.transactionService.getById(transactionId);
        return result;
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => transaction_entity_1.Transaction, { name: 'create' }),
    __param(0, (0, graphql_1.Args)('createTransactionInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaction_input_1.CreateTransactionInput]),
    __metadata("design:returntype", void 0)
], TransactionResolver.prototype, "createTransaction", null);
__decorate([
    (0, graphql_1.Query)(() => transaction_entity_1.Transaction, { name: 'findById' }),
    __param(0, (0, graphql_1.Args)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TransactionResolver.prototype, "findById", null);
TransactionResolver = __decorate([
    (0, graphql_1.Resolver)(() => transaction_entity_1.Transaction),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionResolver);
exports.TransactionResolver = TransactionResolver;
//# sourceMappingURL=transaction.resolver.js.map