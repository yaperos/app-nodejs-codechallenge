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
const anti_fraud_validation_command_1 = require("./module/application/command/anti-fraud-validation.command");
const microservices_1 = require("@nestjs/microservices");
const anti_fraud_validation_infrastructure_1 = require("./module/infrastructure/anti-fraud-validation.infrastructure");
const anti_fraud_validation_controller_1 = require("./module/interfaces/controller/v1/anti-fraud-validation.controller");
const imports = [
    config_1.ConfigModule.forRoot(),
    cqrs_1.CqrsModule,
    axios_1.HttpModule,
    terminus_1.TerminusModule,
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
const controllers = [anti_fraud_validation_controller_1.AntiFraudValidationController];
const providersFactory = [];
const providersApplication = [anti_fraud_validation_command_1.GetAntiFraudValidationEventCommandHandler];
const providersInfrastructure = [anti_fraud_validation_infrastructure_1.AntiFraudValidationInfrastructure];
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
            ...providersFactory,
            ...providersApplication,
            ...providersInfrastructure,
        ],
    }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map