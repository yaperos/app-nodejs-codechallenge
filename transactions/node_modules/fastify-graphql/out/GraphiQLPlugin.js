"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __importDefault(require("url"));
const apollo_server_module_graphiql_1 = require("apollo-server-module-graphiql");
function GraphiQLPlugin(fastify, options, next) {
    options = Object.assign({
        prefix: '/graphiql',
        graphiql: {
            endpointURL: '/graphql',
        },
    }, options);
    const handler = (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            const query = request.req.url && url_1.default.parse(request.req.url, true).query;
            const graphiqlString = yield apollo_server_module_graphiql_1.resolveGraphiQLString(query, options.graphiql, [request, reply]);
            reply.type('text/html').send(graphiqlString);
        }
        catch (error) {
            reply.code(500);
            reply.send(error.message);
        }
    });
    fastify.get('/', handler);
    next();
}
exports.default = GraphiQLPlugin;
//# sourceMappingURL=GraphiQLPlugin.js.map