"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_js_1 = __importDefault(require("../sequelize.js"));
const TransactionStatus = sequelize_js_1.default.define('transaction_status', {
    transaction_status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    freezeTableName: true,
    tableName: 'transaction_status'
});
exports.default = TransactionStatus;
