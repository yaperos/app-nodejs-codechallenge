"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const app = (0, express_1.Router)();
const aTransactionTypesController = new controller_1.TransactionTypesController();
app.get('/', aTransactionTypesController.getAll);
app.post('/', aTransactionTypesController.create);
exports.default = app;
