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
exports.TransactionVerifyInfrastructure = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const constants_1 = require("../../core/helpers/constants");
const transaction_verify_entity_1 = require("./entities/transaction-verify.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const transaction_verify_dto_1 = require("./dto/transaction-verify.dto");
let TransactionVerifyInfrastructure = class TransactionVerifyInfrastructure {
    constructor(kafkaAuthClient, transactionVerifyRepository, logger) {
        this.kafkaAuthClient = kafkaAuthClient;
        this.transactionVerifyRepository = transactionVerifyRepository;
        this.logger = logger;
    }
    async saveTransactionVerify(transactionVerifyRequest) {
        const transactionEntity = transaction_verify_dto_1.TransactionVerifyDto.fromDomainToEntity(transactionVerifyRequest);
        const transactionVerifyResult = await this.transactionVerifyRepository.save(transactionEntity);
        const transactionVerifyResponse = transaction_verify_dto_1.TransactionVerifyDto.fromDataToDomain(transactionVerifyResult);
        return transactionVerifyResponse;
    }
    async updateTransactionVerify(transactionVerifyUpdate) {
        const transactionVerify = await this.transactionVerifyRepository.findOne({
            where: {
                transactionExternalId: transactionVerifyUpdate.transactionExternalId,
            },
        });
        if (!transactionVerify) {
            return null;
        }
        transactionVerify.transactionStatus = {
            id: constants_1.TransactionStatus[transactionVerifyUpdate.status],
            name: transactionVerifyUpdate.status,
        };
        await this.transactionVerifyRepository.save(transactionVerify);
    }
    async emitterToValidateAntiFraud(transactionVerify) {
        this.logger.log(`Emit to verify anti fraud with values : ${JSON.stringify(transactionVerify)}`);
        return this.kafkaAuthClient.emit(process.env.CLIENT_TRANSACTION_VERIFY_MS, JSON.stringify(transactionVerify));
    }
    async findTransactionVerifyById(transactionExternalId) {
        const transactionVerify = await this.transactionVerifyRepository.findOne({
            where: {
                transactionExternalId,
            },
        });
        if (!transactionVerify) {
            return null;
        }
        const transactionVerifyResponse = transaction_verify_dto_1.TransactionVerifyDto.fromDataToDomain(transactionVerify);
        return transactionVerifyResponse;
    }
};
TransactionVerifyInfrastructure = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(constants_1.ClientModuleRegister)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_verify_entity_1.TransactionVerifyEntity)),
    __metadata("design:paramtypes", [microservices_1.ClientKafka,
        typeorm_2.Repository,
        common_1.Logger])
], TransactionVerifyInfrastructure);
exports.TransactionVerifyInfrastructure = TransactionVerifyInfrastructure;
//# sourceMappingURL=transacion-verify.infrastructure.js.map