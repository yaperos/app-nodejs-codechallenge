"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientNats = void 0;
const tslib_1 = require("tslib");
const logger_service_1 = require("@nestjs/common/services/logger.service");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const constants_1 = require("../constants");
const nats_response_json_deserializer_1 = require("../deserializers/nats-response-json.deserializer");
const empty_response_exception_1 = require("../errors/empty-response.exception");
const nats_record_serializer_1 = require("../serializers/nats-record.serializer");
const client_proxy_1 = require("./client-proxy");
let natsPackage = {};
/**
 * @publicApi
 */
class ClientNats extends client_proxy_1.ClientProxy {
    constructor(options) {
        super();
        this.options = options;
        this.logger = new logger_service_1.Logger(ClientNats.name);
        natsPackage = (0, load_package_util_1.loadPackage)('nats', ClientNats.name, () => require('nats'));
        this.initializeSerializer(options);
        this.initializeDeserializer(options);
    }
    async close() {
        var _a;
        await ((_a = this.natsClient) === null || _a === void 0 ? void 0 : _a.close());
        this.natsClient = null;
    }
    async connect() {
        if (this.natsClient) {
            return this.natsClient;
        }
        this.natsClient = await this.createClient();
        this.handleStatusUpdates(this.natsClient);
        return this.natsClient;
    }
    createClient() {
        const options = this.options || {};
        return natsPackage.connect(Object.assign({ servers: constants_1.NATS_DEFAULT_URL }, options));
    }
    async handleStatusUpdates(client) {
        var _a, e_1, _b, _c;
        try {
            for (var _d = true, _e = tslib_1.__asyncValues(client.status()), _f; _f = await _e.next(), _a = _f.done, !_a;) {
                _c = _f.value;
                _d = false;
                try {
                    const status = _c;
                    const data = status.data && (0, shared_utils_1.isObject)(status.data)
                        ? JSON.stringify(status.data)
                        : status.data;
                    switch (status.type) {
                        case 'error':
                        case 'disconnect':
                            this.logger.error(`NatsError: type: "${status.type}", data: "${data}".`);
                            break;
                        case 'pingTimer':
                            if (this.options.debug) {
                                this.logger.debug(`NatsStatus: type: "${status.type}", data: "${data}".`);
                            }
                            break;
                        default:
                            this.logger.log(`NatsStatus: type: "${status.type}", data: "${data}".`);
                            break;
                    }
                }
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    createSubscriptionHandler(packet, callback) {
        return async (error, natsMsg) => {
            if (error) {
                return callback({
                    err: error,
                });
            }
            const rawPacket = natsMsg.data;
            if ((rawPacket === null || rawPacket === void 0 ? void 0 : rawPacket.length) === 0) {
                return callback({
                    err: new empty_response_exception_1.EmptyResponseException(this.normalizePattern(packet.pattern)),
                    isDisposed: true,
                });
            }
            const message = await this.deserializer.deserialize(rawPacket);
            if (message.id && message.id !== packet.id) {
                return undefined;
            }
            const { err, response, isDisposed } = message;
            if (isDisposed || err) {
                return callback({
                    err,
                    response,
                    isDisposed: true,
                });
            }
            callback({
                err,
                response,
            });
        };
    }
    publish(partialPacket, callback) {
        try {
            const packet = this.assignPacketId(partialPacket);
            const channel = this.normalizePattern(partialPacket.pattern);
            const serializedPacket = this.serializer.serialize(packet);
            const inbox = natsPackage.createInbox();
            const subscriptionHandler = this.createSubscriptionHandler(packet, callback);
            const subscription = this.natsClient.subscribe(inbox, {
                callback: subscriptionHandler,
            });
            const headers = this.mergeHeaders(serializedPacket.headers);
            this.natsClient.publish(channel, serializedPacket.data, {
                reply: inbox,
                headers,
            });
            return () => subscription.unsubscribe();
        }
        catch (err) {
            callback({ err });
        }
    }
    dispatchEvent(packet) {
        const pattern = this.normalizePattern(packet.pattern);
        const serializedPacket = this.serializer.serialize(packet);
        const headers = this.mergeHeaders(serializedPacket.headers);
        return new Promise((resolve, reject) => {
            try {
                this.natsClient.publish(pattern, serializedPacket.data, {
                    headers,
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    initializeSerializer(options) {
        var _a;
        this.serializer = (_a = options === null || options === void 0 ? void 0 : options.serializer) !== null && _a !== void 0 ? _a : new nats_record_serializer_1.NatsRecordSerializer();
    }
    initializeDeserializer(options) {
        var _a;
        this.deserializer =
            (_a = options === null || options === void 0 ? void 0 : options.deserializer) !== null && _a !== void 0 ? _a : new nats_response_json_deserializer_1.NatsResponseJSONDeserializer();
    }
    mergeHeaders(requestHeaders) {
        var _a, _b;
        if (!requestHeaders && !((_a = this.options) === null || _a === void 0 ? void 0 : _a.headers)) {
            return undefined;
        }
        const headers = requestHeaders !== null && requestHeaders !== void 0 ? requestHeaders : natsPackage.headers();
        for (const [key, value] of Object.entries(((_b = this.options) === null || _b === void 0 ? void 0 : _b.headers) || {})) {
            if (!headers.has(key)) {
                headers.set(key, value);
            }
        }
        return headers;
    }
}
exports.ClientNats = ClientNats;
