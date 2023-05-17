"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const retrieve_controller_1 = require("./retrieve.controller");
const retrieve_service_1 = require("./retrieve.service");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const default_1 = require("@apollo/server/plugin/landingPage/default");
const transaction_module_1 = require("../transaction/transaction.module");
const microservices_1 = require("@nestjs/microservices");
const prisma_module_1 = require("../prisma/prisma.module");
const apollloServer = (0, default_1.ApolloServerPluginLandingPageLocalDefault)();
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                playground: false,
                plugins: [apollloServer],
            }),
            microservices_1.ClientsModule.register([
                {
                    name: 'any_name_i_want',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        subscribe: {
                            fromBeginning: true,
                        },
                        client: {
                            clientId: 'transactions-validate',
                            brokers: ['kafka:9092'],
                        },
                    },
                },
            ]),
            prisma_module_1.PrismaModule,
            transaction_module_1.TransactionModule,
        ],
        controllers: [retrieve_controller_1.RetriveController],
        providers: [retrieve_service_1.RetriveService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=retrieve.module.js.map