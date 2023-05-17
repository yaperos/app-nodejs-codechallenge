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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const microservices_1 = require("@nestjs/microservices");
class KillDragonMessage {
}
let AppController = class AppController {
    constructor(appService, client) {
        this.appService = appService;
        this.client = client;
    }
    async onModuleInit() {
        ['transactions.created'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
        await this.client.connect();
    }
    getHello() {
        return this.appService.getHello();
    }
    killDragon(message) {
        console.log(message);
        const realm = 'Nest';
        const heroId = message.heroId;
        const dragonId = message.dragonId;
        const data = { realm, heroId, dragonId };
        console.log(data);
    }
    sendMessage(dragonId, name, heroId) {
        console.log('Here');
        const killDragonMessage = {
            dragonId,
            name,
            heroId,
        };
        console.log(killDragonMessage);
        this.client.emit('transactions.created', killDragonMessage);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, microservices_1.MessagePattern)('hero.kill.dragon'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KillDragonMessage]),
    __metadata("design:returntype", Object)
], AppController.prototype, "killDragon", null);
__decorate([
    (0, common_1.Post)('/send'),
    __param(0, (0, common_1.Body)('dragonId')),
    __param(1, (0, common_1.Body)('name')),
    __param(2, (0, common_1.Body)('heroId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "sendMessage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, common_1.Inject)('any_name_i_want')),
    __metadata("design:paramtypes", [app_service_1.AppService,
        microservices_1.ClientKafka])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map