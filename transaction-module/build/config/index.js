"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.environmentVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './transaction-module/.env' });
exports.environmentVariables = {
    port: parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8010', 10),
    database: {
        user: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        database: process.env.DB_NAME_DEV,
        host: process.env.DB_HOST_DEV,
        port: process.env.DB_PORT_DEV,
        dialect: 'mysql'
    },
    kafka: {
        transaction_topic: (_b = process.env.TRANSACTION_TOPIC) !== null && _b !== void 0 ? _b : 'transaction_topic',
        client_id: (_c = process.env.CLIENT_ID) !== null && _c !== void 0 ? _c : 'transaction_integration',
        brokers: (_e = String((_d = process.env.KAFKA_BROKERS) !== null && _d !== void 0 ? _d : '').split(',')) !== null && _e !== void 0 ? _e : ['kafka:9092']
    }
};
