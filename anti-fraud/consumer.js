"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafkajs_1 = require("kafkajs");
var kafka = new kafkajs_1.Kafka({
    clientId: 'anti-fraud',
    brokers: [process.env.KAFKA_BROKER || 'kafka:29092'], //localhost:9092
});
var consumer = kafka.consumer({ groupId: 'notification-group' });
var producer = kafka.producer();
var handleMessage = function (_a) {
    var topic = _a.topic, partition = _a.partition, message = _a.message;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    console.log("Received message from topic '".concat(topic, "': ").concat((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()));
                    if (!(topic === 'new-transaction')) return [3 /*break*/, 2];
                    console.log('Message received:', (_c = message.value) === null || _c === void 0 ? void 0 : _c.toString());
                    return [4 /*yield*/, runProducer((_d = message.value) === null || _d === void 0 ? void 0 : _d.toString())];
                case 1:
                    _e.sent();
                    return [3 /*break*/, 3];
                case 2:
                    console.log('Unknown topic:', topic);
                    _e.label = 3;
                case 3: return [4 /*yield*/, consumer.commitOffsets([{ topic: topic, partition: partition, offset: message.offset }])];
                case 4:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var runConsumer = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, consumer.connect()];
            case 1:
                _a.sent();
                return [4 /*yield*/, producer.connect()];
            case 2:
                _a.sent();
                return [4 /*yield*/, consumer.subscribe({ topic: 'new-transaction' })];
            case 3:
                _a.sent();
                console.log('Consumer subscribed to topics: new-transaction');
                return [4 /*yield*/, consumer.run({
                        eachMessage: handleMessage,
                    })];
            case 4:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sendMessage = function (topic, message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, producer.send({
                    topic: topic,
                    messages: [{ value: message }],
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var sendNotification = function (topic, payload) { return __awaiter(void 0, void 0, void 0, function () {
    var message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                message = JSON.stringify(payload);
                return [4 /*yield*/, sendMessage(topic, message)];
            case 1:
                _a.sent();
                console.log("Message sent to ".concat(topic, ": ").concat(message));
                return [2 /*return*/];
        }
    });
}); };
var runProducer = function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var status, messageDecoded, payload;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                messageDecoded = JSON.parse(message);
                console.log("---> value received: ", messageDecoded.value);
                if (messageDecoded.value > 1000) {
                    status = 'rejected';
                }
                else {
                    status = 'approved';
                }
                payload = {
                    database_id: messageDecoded.database_id,
                    status: status
                };
                console.log("-------> about to produce!");
                return [4 /*yield*/, sendNotification('anti-fraud', payload)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
runConsumer()
    .then(function () {
    console.log('Consumer is running...');
})
    .catch(function (error) {
    console.error('Failed to run kafka consumer', error);
});
