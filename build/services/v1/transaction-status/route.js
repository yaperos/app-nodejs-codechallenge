"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const app = (0, express_1.Router)();
const aTransactionStatusController = new controller_1.TransactionStatusController();
app.get('/', aTransactionStatusController.getAll);
app.post('/', aTransactionStatusController.create);
exports.default = app;
