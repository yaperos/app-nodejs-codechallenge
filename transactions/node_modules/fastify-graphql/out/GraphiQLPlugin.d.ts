/// <reference types="node" />
import { GraphiQLData } from 'apollo-server-module-graphiql';
import { FastifyInstance } from 'fastify';
import { IncomingMessage, OutgoingMessage, Server } from 'http';
declare function GraphiQLPlugin(fastify: FastifyInstance<Server, IncomingMessage, OutgoingMessage>, options: {
    prefix: string;
    graphiql: GraphiQLData | Function;
}, next: (err?: Error) => void): void;
export default GraphiQLPlugin;
