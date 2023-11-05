"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-types */
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const message_broker_consumer_provider_1 = require("./providers/message-broker-consumer.provider");
require("./services/antifraud/events");
const app = (0, express_1.default)();
message_broker_consumer_provider_1.MessageQueueConsumer.start();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
exports.default = app;
