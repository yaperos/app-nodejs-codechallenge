"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_js_1 = __importDefault(require("../sequelize.js"));
const transaction_status_model_js_1 = __importDefault(require("./transaction-status.model.js"));
const transaction_types_model_js_1 = __importDefault(require("./transaction-types.model.js"));
const Transactions = sequelize_js_1.default.define('transactions', {
    transaction_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true
    },
    accountExternalIdDebit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    accountExternalIdCredit: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    transferTypeId: {
        type: sequelize_1.DataTypes.STRING(2)
    },
    value: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    transaction_status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true
});
Transactions.hasOne(transaction_status_model_js_1.default, {
    foreignKey: 'transaction_status_id',
    sourceKey: 'transaction_status_id'
});
Transactions.hasOne(transaction_types_model_js_1.default, {
    foreignKey: 'transaction_type_id',
    sourceKey: 'transferTypeId'
});
exports.default = Transactions;
