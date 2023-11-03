"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = void 0;
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const config_js_1 = require("./config.js");
const promise_1 = __importDefault(require("mysql2/promise"));
const sequelize_1 = require("sequelize");
const { host, port, user, password, database } = config_js_1.dbEnvironments.development;
async function initializeDb() {
    const connection = await promise_1.default.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();
}
exports.initializeDb = initializeDb;
const sequelize = new sequelize_1.Sequelize(database, user, password, {
    dialect: 'mysql',
    host
});
exports.default = sequelize;
