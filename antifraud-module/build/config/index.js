"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '././.env' });
exports.environmentVariables = {
    port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8010', 10),
    kafka: {
        transaction_topic: (_b = process.env.TRANSACTION_TOPIC) !== null && _b !== void 0 ? _b : 'transaction_topic',
        client_id: (_c = process.env.CLIENT_ID) !== null && _c !== void 0 ? _c : 'transaction_integration',
        brokers: [(_d = process.env.KAFKA_BROKERS) !== null && _d !== void 0 ? _d : 'kafka:9092']
    }
};
