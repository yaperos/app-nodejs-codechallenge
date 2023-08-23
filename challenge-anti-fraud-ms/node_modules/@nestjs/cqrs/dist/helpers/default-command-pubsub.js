"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCommandPubSub = void 0;
class DefaultCommandPubSub {
    constructor(subject$) {
        this.subject$ = subject$;
    }
    publish(command) {
        this.subject$.next(command);
    }
}
exports.DefaultCommandPubSub = DefaultCommandPubSub;
