"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const route_1 = __importDefault(require("./transactions/route"));
const route_2 = __importDefault(require("./transactions-types/route"));
const route_3 = __importDefault(require("./transaction-status/route"));
const app = (0, express_1.Router)();
app.use('/transactions', route_1.default);
app.use('/transactions-types', route_2.default);
app.use('/transactions-status', route_3.default);
exports.default = app;
