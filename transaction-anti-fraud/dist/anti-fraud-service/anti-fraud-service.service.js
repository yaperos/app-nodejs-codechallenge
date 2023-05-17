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
var AntiFraudServiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiFraudServiceService = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_entity_1 = require("./entities/transaction.service.entity");
const microservices_1 = require("@nestjs/microservices");
let AntiFraudServiceService = AntiFraudServiceService_1 = class AntiFraudServiceService {
    constructor(client) {
        this.client = client;
    }
    create(createAntiFraudServiceDto) {
        console.log("Hola mundo viejo cochino");
        console.log('create', createAntiFraudServiceDto);
        const transaction = new transaction_service_entity_1.Transaction(createAntiFraudServiceDto);
        console.log('transaction', transaction);
        const antiFraudService = new AntiFraudServiceService_1(this.client);
        transaction.attach(antiFraudService);
        transaction.setStatus('pending');
    }
    update(transaction) {
        console.log('update', transaction);
        const value = transaction.value;
        let transactionToSend = {
            accountExternalIdDebit: transaction.accountExternalIdDebit,
            accountExternalIdCredit: transaction.accountExternalIdCredit,
            tranferTypeId: transaction.tranferTypeId,
            value: transaction.value,
            transactionExternalId: transaction.transactionExternalId,
            transactionType: transaction.transactionType,
            transactionStatus: transaction.transactionStatus,
        };
        if (transaction.transactionStatus === 'pending') {
            if (value < 1000) {
                transaction.setStatus('approved');
                const status = transaction.getStatus();
                console.log('status', status);
                transactionToSend = Object.assign(Object.assign({}, transactionToSend), { transactionStatus: status });
                this.publish('transactions.approved', transactionToSend);
            }
            else {
                transaction.setStatus('rejected');
                transactionToSend = Object.assign(Object.assign({}, transactionToSend), { transactionStatus: transaction.getStatus() });
                this.publish('transactions.rejected', transactionToSend);
            }
        }
    }
    publish(topic, transaction) {
        console.log("SEND TO TRANSACTION", topic, transaction);
        console.log(topic, transaction);
        this.client.emit(topic, JSON.stringify(Object.assign({}, transaction)));
    }
};
AntiFraudServiceService = AntiFraudServiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('any_name_i_want')),
    __metadata("design:paramtypes", [microservices_1.ClientKafka])
], AntiFraudServiceService);
exports.AntiFraudServiceService = AntiFraudServiceService;
//# sourceMappingURL=anti-fraud-service.service.js.map