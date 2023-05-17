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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const graphql_1 = require("@nestjs/graphql");
let Transaction = class Transaction {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Transaction.prototype, "accountExternalIdDebit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Transaction.prototype, "accountExternalIdCredit", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", Number)
], Transaction.prototype, "tranferTypeId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], Transaction.prototype, "value", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Transaction.prototype, "transactionExternalId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Transaction.prototype, "transactionType", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Transaction.prototype, "transactionStatus", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
Transaction = __decorate([
    (0, graphql_1.ObjectType)()
], Transaction);
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map