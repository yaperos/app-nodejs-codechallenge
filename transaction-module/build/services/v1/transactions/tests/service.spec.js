"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = require("chai");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../../../app"));
const mocks = __importStar(require("./service.mock"));
const transactions_dao_1 = require("../../../../models/transactions/transactions.dao");
const transaction_types_dao_1 = require("../../../../models/transaction-types/transaction-types.dao");
const transaction_status_dao_1 = require("../../../../models/transaction-status/transaction-status.dao");
const message_broker_producer_provider_1 = require("../../../../providers/message-broker-producer.provider");
describe('Transactions #Integration', function () {
    const aTransactionsDao = new transactions_dao_1.TransactionsDao();
    const aTransactionTypesDao = new transaction_types_dao_1.TransactionTypesDao();
    const aTransactionStatusDao = new transaction_status_dao_1.TransactionStatusDao();
    before('Insert initial data', async () => {
        await aTransactionsDao.bulkCreate(mocks.transactionsMock);
        await aTransactionTypesDao.bulkCreate(mocks.transactionTypesMock);
        await aTransactionStatusDao.bulkCreate(mocks.transactionStatusMock);
    });
    after('Remove data', async () => {
        await aTransactionsDao.clearTable();
        await aTransactionTypesDao.clearTable();
        await aTransactionStatusDao.clearTable();
    });
    describe('GET - /api/v1/transactions', () => {
        it('When read transactions, then send all transactions', async () => {
            const endpoint = '/api/v1/transactions';
            const { body, status } = await (0, supertest_1.default)(app_1.default).get(`${endpoint}`);
            (0, chai_1.expect)(body).to.be.eql(mocks.transactionResponseMock);
            (0, chai_1.expect)(status).to.be.eql(200);
        });
        it('When read transactions with value filter, then send all transactions with those values', async () => {
            const endpoint = '/api/v1/transactions';
            const transactionsThatMatch = mocks.transactionResponseMock.data.filter((transaction) => transaction.value === 1111);
            const response = {
                data: transactionsThatMatch,
                pagination: {
                    count: 1,
                    limit: 20,
                    page: 1
                }
            };
            const { body, status } = await (0, supertest_1.default)(app_1.default).get(`${endpoint}`).query({ value: 1111 });
            (0, chai_1.expect)(body).to.be.eql(response);
            (0, chai_1.expect)(status).to.be.eql(200);
        });
        it('When read transactions with transaction_id filter, then send the transaction with that id', async () => {
            const endpoint = '/api/v1/transactions';
            const transactionsThatMatch = mocks.transactionResponseMock.data.filter((transaction) => transaction.transaction_id === 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963');
            const response = {
                data: transactionsThatMatch,
                pagination: {
                    count: 1,
                    limit: 20,
                    page: 1
                }
            };
            const { body, status } = await (0, supertest_1.default)(app_1.default)
                .get(`${endpoint}`)
                .query({ transaction_id: 'ad161029-8f5b-4b2b-8ca9-20ffbf1d8963' });
            (0, chai_1.expect)(body).to.be.eql(response);
            (0, chai_1.expect)(status).to.be.eql(200);
        });
        it('When a valid request is sent with limit, then returned limited', async () => {
            const endpoint = '/api/v1/transactions';
            const { body, status } = await (0, supertest_1.default)(app_1.default).get(`${endpoint}`).query({ limit: 1, page: 1 });
            (0, chai_1.expect)(body).to.be.eql({
                data: [mocks.transactionResponseMock.data[0]],
                pagination: {
                    limit: 1,
                    page: 1,
                    count: mocks.transactionResponseMock.data.length
                }
            });
            (0, chai_1.expect)(status).to.be.eql(200);
        });
    });
    describe('POST - /api/v1/transactions', () => {
        const sandbox = sinon_1.default.createSandbox();
        const kafka = message_broker_producer_provider_1.MessageQueueProducer.getInstance();
        beforeEach(() => {
            sandbox.stub(kafka, 'connect').resolves();
        });
        afterEach(() => {
            sandbox.restore();
        });
        it('When send required params, then create a transactions in DB', async () => {
            const endpoint = '/api/v1/transactions';
            const { body, status } = await (0, supertest_1.default)(app_1.default)
                .post(`${endpoint}`)
                .send(mocks.createdTransactionMock);
            delete body.data.updatedAt;
            (0, chai_1.expect)(body).to.be.eql({ data: mocks.createdTransactionMock });
            (0, chai_1.expect)(status).to.be.eql(200);
        });
    });
});
