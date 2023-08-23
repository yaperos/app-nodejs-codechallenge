"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaRequestDeserializer = void 0;
const incoming_request_deserializer_1 = require("./incoming-request.deserializer");
/**
 * @publicApi
 */
class KafkaRequestDeserializer extends incoming_request_deserializer_1.IncomingRequestDeserializer {
    mapToSchema(data, options) {
        var _a;
        if (!options) {
            return {
                pattern: undefined,
                data: undefined,
            };
        }
        return {
            pattern: options.channel,
            data: (_a = data === null || data === void 0 ? void 0 : data.value) !== null && _a !== void 0 ? _a : data,
        };
    }
}
exports.KafkaRequestDeserializer = KafkaRequestDeserializer;
