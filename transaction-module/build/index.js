"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const index_1 = require("./config/index");
const port = index_1.environmentVariables.port;
const server = http_1.default.createServer(app_1.default);
server.listen(port, '0.0.0.0', () => {
    console.log(`Server Running on Port ${port}`);
});
