"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cqrs_1 = require("@nestjs/cqrs");
const terminus_1 = require("@nestjs/terminus");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const healthcheck_controller_1 = require("./module/interfaces/http/healthcheck.controller");
const microservices_1 = require("@nestjs/microservices");
const transaction_verify_entity_1 = require("./module/infrastructure/entities/transaction-verify.entity");
const transaction_verify_type_entity_1 = require("./module/infrastructure/entities/transaction-verify-type.entity");
const transaction_verify_status_entity_1 = require("./module/infrastructure/entities/transaction-verify-status.entity");
const transaction_verify_controller_1 = require("./module/interfaces/http/v1/transaction/transaction-verify.controller");
const save_transaction_verify_event_command_1 = require("./module/application/command/save-transaction-verify-event.command");
const transacion_verify_infrastructure_1 = require("./module/infrastructure/transacion-verify.infrastructure");
const update_transaction_verify_event_command_1 = require("./module/application/command/update-transaction-verify-event.command");
const get_transaction_verify_event_query_1 = require("./module/application/query/get-transaction-verify-event.query");
const imports = [
    config_1.ConfigModule.forRoot(),
    cqrs_1.CqrsModule,
    axios_1.HttpModule,
    terminus_1.TerminusModule,
    typeorm_1.TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.HOST_ORM,
        port: parseInt(process.env.PORT_ORM),
        username: process.env.USERNAME_ORM,
        password: process.env.PASSWORD_ORM,
        database: process.env.DATABASE_ORM,
        entities: [
            transaction_verify_entity_1.TransactionVerifyEntity,
            transaction_verify_type_entity_1.TransactionVerifyTypeEntity,
            transaction_verify_status_entity_1.TransactionVerifyStatusEntity,
        ],
        synchronize: true,
    }),
    typeorm_1.TypeOrmModule.forFeature([
        transaction_verify_entity_1.TransactionVerifyEntity,
        transaction_verify_type_entity_1.TransactionVerifyTypeEntity,
        transaction_verify_status_entity_1.TransactionVerifyStatusEntity,
    ]),
    microservices_1.ClientsModule.register([
        {
            name: process.env.CLIENT_MODULE_REGISTER,
            transport: microservices_1.Transport.KAFKA,
            options: {
                client: {
                    brokers: [process.env.BROKER],
                },
                consumer: {
                    groupId: process.env.GROUP_ID,
                },
            },
        },
    ]),
];
const controllers = [transaction_verify_controller_1.TransactionVerifyController, healthcheck_controller_1.HealthcheckController];
const providersFactory = [];
const providersApplication = [
    save_transaction_verify_event_command_1.SaveTransactionVerifyCommandHandler,
    update_transaction_verify_event_command_1.UpdateTransactionVerifyEventCommandHandler,
    get_transaction_verify_event_query_1.GetTransactionVerifyEventCommandHandler,
];
const providersInfrastructure = [transacion_verify_infrastructure_1.TransactionVerifyInfrastructure];
let AppModule = AppModule_1 = class AppModule {
    constructor(configService) {
        this.configService = configService;
        AppModule_1.port = this.configService.get('PORT') || 80;
    }
};
AppModule = AppModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [...imports],
        controllers: [...controllers],
        providers: [
            common_1.Logger,
            app_service_1.AppService,
            ...providersFactory,
            ...providersApplication,
            ...providersInfrastructure,
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map