"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbEnvironments = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbEnvironments = {
    development: {
        user: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        database: process.env.DB_NAME_DEV,
        host: process.env.DB_HOST_DEV,
        port: process.env.DB_PORT_DEV,
        dialect: 'mysql'
    }
};
