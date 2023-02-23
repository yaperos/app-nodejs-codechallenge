/// <reference types="node" />
import { GraphQLOptions } from 'apollo-server-core';
import { FastifyInstance } from 'fastify';
import { IncomingMessage, OutgoingMessage, Server } from 'http';
declare function GraphQLPlugin(fastify: FastifyInstance<Server, IncomingMessage, OutgoingMessage>, pluginOptions: {
    prefix: string;
    graphql: Function | GraphQLOptions;
}, next: (err?: Error) => void): void;
export default GraphQLPlugin;
