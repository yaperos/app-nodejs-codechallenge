"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultQueryPubSub = void 0;
class DefaultQueryPubSub {
    constructor(subject$) {
        this.subject$ = subject$;
    }
    publish(query) {
        this.subject$.next(query);
    }
}
exports.DefaultQueryPubSub = DefaultQueryPubSub;
