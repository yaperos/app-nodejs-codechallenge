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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const microservices_1 = require("@nestjs/microservices");
const datadog_1 = require("../datadog");
let TransactionService = class TransactionService {
    constructor(prisma, client) {
        this.prisma = prisma;
        this.client = client;
    }
    async create(createTransactionInput) {
        function createFakeTransaction() {
            const transaction = {
                transactionExternalId: generateRandomId(),
                accountExternalIdDebit: generateRandomId(),
                accountExternalIdCredit: generateRandomId(),
                tranferTypeId: generateRandomNumber(),
                value: generateRandomNumber(),
                transactionType: generateRandomWord(),
                transactionStatus: generateRandomWord(),
                createdAt: generateRandomDate(),
            };
            return transaction;
        }
        function generateRandomId() {
            return 'fake-id-' + Math.random().toString(36).substring(7);
        }
        function generateRandomNumber() {
            return Math.floor(Math.random() * 10000);
        }
        function generateRandomWord() {
            return Math.random().toString(36).substring(7);
        }
        function generateRandomDate() {
            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear() - 10, currentDate.getMonth(), currentDate.getDate());
            const endDate = new Date();
            const randomTimestamp = startDate.getTime() +
                Math.random() * (endDate.getTime() - startDate.getTime());
            return new Date(randomTimestamp);
        }
        createTransactionInput = createFakeTransaction();
        console.log(createTransactionInput);
        const result = await this.prisma.transaction.create({
            data: createTransactionInput,
        });
        const response = {
            accountExternalIdDebit: result.accountExternalIdDebit,
            accountExternalIdCredit: result.accountExternalIdCredit,
            tranferTypeId: result.tranferTypeId,
            value: result.value,
            transactionExternalId: result.transactionExternalId,
            transactionType: result.transactionType,
            transactionStatus: result.transactionStatus,
        };
        this.client.emit('transactions.created', JSON.stringify(response));
        return response;
    }
    async getById(id) {
        datadog_1.logger.log('info', { type: 'getById', id });
        const result = await this.prisma.transaction.findUnique({
            where: {
                transactionExternalId: id,
            },
        });
        console.log('results', result);
        const response = {
            accountExternalIdDebit: result.accountExternalIdDebit,
            accountExternalIdCredit: result.accountExternalIdCredit,
            tranferTypeId: result.tranferTypeId,
            value: result.value,
            transactionExternalId: result.transactionExternalId,
            transactionType: result.transactionType,
            transactionStatus: result.transactionStatus,
            createdAt: result.createdAt,
        };
        datadog_1.logger.log('info', response);
        console.log(response);
        return response;
    }
};
TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('kafk_client_transaction')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        microservices_1.ClientKafka])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map