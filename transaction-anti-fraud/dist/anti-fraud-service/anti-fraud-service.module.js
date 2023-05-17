"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiFraudServiceModule = void 0;
const common_1 = require("@nestjs/common");
const anti_fraud_service_service_1 = require("./anti-fraud-service.service");
const anti_fraud_service_controller_1 = require("./anti-fraud-service.controller");
const microservices_1 = require("@nestjs/microservices");
let AntiFraudServiceModule = class AntiFraudServiceModule {
};
AntiFraudServiceModule = __decorate([
    (0, common_1.Module)({
        imports: [microservices_1.ClientsModule.register([
                {
                    name: 'any_name_i_want',
                    transport: microservices_1.Transport.KAFKA,
                    options: {
                        subscribe: {
                            fromBeginning: true,
                        },
                        client: {
                            clientId: 'transactions-validate-fraud',
                            brokers: ['kafka:9092'],
                        },
                    },
                },
            ])],
        controllers: [anti_fraud_service_controller_1.AntiFraudServiceController],
        providers: [anti_fraud_service_service_1.AntiFraudServiceService]
    })
], AntiFraudServiceModule);
exports.AntiFraudServiceModule = AntiFraudServiceModule;
//# sourceMappingURL=anti-fraud-service.module.js.map