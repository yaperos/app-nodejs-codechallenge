"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
function GraphQLPlugin(fastify, pluginOptions, next) {
    if (!pluginOptions)
        throw new Error('Fastify GraphQL requires options!');
    else if (!pluginOptions.prefix)
        throw new Error('Fastify GraphQL requires `prefix` to be part of passed options!');
    else if (!pluginOptions.graphql)
        throw new Error('Fastify GraphQL requires `graphql` to be part of passed options!');
    const handler = (request, reply) => __awaiter(this, void 0, void 0, function* () {
        try {
            let method = request.req.method;
            const gqlResponse = yield apollo_server_core_1.runHttpQuery([request, reply], {
                method: method,
                options: pluginOptions.graphql,
                query: method === 'POST' ? request.body : request.query,
            });
            // bypass Fastify's response layer, so we can avoid having to
            // parse the serialized gqlResponse due to Fastify's internal 
            // JSON serializer seeing our Content-Type header and assuming 
            // the response payload is unserialized
            reply.sent = true;
            reply.res.setHeader('Content-Type', 'application/json');
            reply.res.end(gqlResponse);
        }
        catch (error) {
            if ('HttpQueryError' !== error.name) {
                throw error;
            }
            if (error.headers) {
                Object.keys(error.headers).forEach(header => {
                    reply.header(header, error.headers[header]);
                });
            }
            reply.code(error.statusCode);
            // error.message is actually a stringified GQL response, see
            // comment @ line 19 for why we bypass Fastify's response layer
            if (error.isGraphQLError) {
                reply.sent = true;
                reply.res.setHeader('Content-Type', 'application/json');
                reply.res.end(error.message);
            }
            else {
                reply.send(error.message);
            }
        }
    });
    fastify.get('/', handler);
    fastify.post('/', handler);
    //TODO determine if this is really the best way to have Fastify not 404 on an invalid HTTP method
    fastify.setNotFoundHandler((request, reply) => {
        if (request.req.method !== 'POST' && request.req.method !== 'POST') {
            reply.code(405);
            reply.header('allow', ['GET', 'POST']);
        }
        else {
            reply.code(404);
        }
        reply.send();
    });
    next();
}
exports.default = GraphQLPlugin;
//# sourceMappingURL=GraphQLPlugin.js.map