"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const GraphQLPlugin_1 = __importDefault(require("./GraphQLPlugin"));
const GraphiQLPlugin_1 = __importDefault(require("./GraphiQLPlugin"));
// prevent fastify-plugin from stripping our prefix
const fp = (plugin) => fastify_plugin_1.default(function (fastify, opts, next) {
    fastify.register(plugin, opts);
    next();
}, {
    fastify: '>=0.40.0',
});
const graphqlFastify = fp(GraphQLPlugin_1.default);
exports.graphqlFastify = graphqlFastify;
const graphiqlFastify = fp(GraphiQLPlugin_1.default);
exports.graphiqlFastify = graphiqlFastify;
//# sourceMappingURL=FastifyGraphQL.js.map