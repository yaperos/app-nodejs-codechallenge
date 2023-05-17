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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiFraudServiceController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const anti_fraud_service_service_1 = require("./anti-fraud-service.service");
const create_anti_fraud_service_dto_1 = require("./dto/create-anti-fraud-service.dto");
let AntiFraudServiceController = class AntiFraudServiceController {
    constructor(antiFraudServiceService) {
        this.antiFraudServiceService = antiFraudServiceService;
    }
    create(createAntiFraudServiceDto) {
        console.log("transactions.created", createAntiFraudServiceDto);
        this.antiFraudServiceService.create(createAntiFraudServiceDto);
    }
};
__decorate([
    (0, microservices_1.MessagePattern)('transactions.created'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_anti_fraud_service_dto_1.CreateAntiFraudServiceDto]),
    __metadata("design:returntype", void 0)
], AntiFraudServiceController.prototype, "create", null);
AntiFraudServiceController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [anti_fraud_service_service_1.AntiFraudServiceService])
], AntiFraudServiceController);
exports.AntiFraudServiceController = AntiFraudServiceController;
//# sourceMappingURL=anti-fraud-service.controller.js.map