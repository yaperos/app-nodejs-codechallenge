"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '8010', 10);
const server = http_1.default.createServer(app_1.default);
server.listen(port, '0.0.0.0', () => {
    console.log(`Server Running on Port ${port}`);
});
