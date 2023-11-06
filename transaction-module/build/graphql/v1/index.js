"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const resolver_1 = require("./transactions/resolver");
const typeDefs_1 = require("./transactions/typeDefs");
const standalone_1 = require("@apollo/server/standalone");
const server = new server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefinitions, resolvers: resolver_1.resolvers, csrfPrevention: true });
async function startServer() {
    await (0, standalone_1.startStandaloneServer)(server, { listen: { port: 4000 } });
    console.log('Graphql running on port 4000');
}
exports.default = startServer();
