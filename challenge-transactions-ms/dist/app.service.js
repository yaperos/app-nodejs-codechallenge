"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBridgeConfig = exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    static get environment() {
        return process.env.ENVIRONMENT || 'LOCAL';
    }
    static get stage() {
        return process.env.STAGE || 'dev';
    }
    static get port() {
        return Number(process.env.PORT) || 3000;
    }
    static get EVENT_BRIDGE_APPOINTMENTS_CONFIG() {
        const { AWS_REGION, EVENT_BRIDGE_ARN, EVENT_BRIDGE_SOURCE_CREATE_APPOINTMENT = 'auna-app', EVENT_BRIDGE_DETAIL_TYPE_CREATE_APPOINTMENT = 'appointments-create', } = process.env;
        return {
            eventBusName: EVENT_BRIDGE_ARN,
            source: EVENT_BRIDGE_SOURCE_CREATE_APPOINTMENT,
            detailType: EVENT_BRIDGE_DETAIL_TYPE_CREATE_APPOINTMENT,
            region: AWS_REGION,
        };
    }
    async onFailedToConnectToDatabase(error) {
        console.error('error: ', error);
        process.exit(1);
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;
class EventBridgeConfig {
}
exports.EventBridgeConfig = EventBridgeConfig;
//# sourceMappingURL=app.service.js.map