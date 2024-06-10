"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const app = (0, express_1.Router)();
const aTransactionController = new controller_1.TransactionController();
app.get('/', aTransactionController.getAll);
app.post('/', aTransactionController.create);
exports.default = app;
