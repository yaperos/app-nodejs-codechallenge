"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const INTERNAL_EVENTS = Symbol();
const IS_AUTO_COMMIT_ENABLED = Symbol();
class AggregateRoot {
    constructor() {
        this[_a] = false;
        this[_b] = [];
    }
    set autoCommit(value) {
        this[IS_AUTO_COMMIT_ENABLED] = value;
    }
    get autoCommit() {
        return this[IS_AUTO_COMMIT_ENABLED];
    }
    publish(event) { }
    publishAll(event) { }
    commit() {
        this.publishAll(this[INTERNAL_EVENTS]);
        this[INTERNAL_EVENTS].length = 0;
    }
    uncommit() {
        this[INTERNAL_EVENTS].length = 0;
    }
    getUncommittedEvents() {
        return this[INTERNAL_EVENTS];
    }
    loadFromHistory(history) {
        history.forEach((event) => this.apply(event, true));
    }
    apply(event, isFromHistory = false) {
        if (!isFromHistory && !this.autoCommit) {
            this[INTERNAL_EVENTS].push(event);
        }
        this.autoCommit && this.publish(event);
        const handler = this.getEventHandler(event);
        handler && handler.call(this, event);
    }
    getEventHandler(event) {
        const handler = `on${this.getEventName(event)}`;
        return this[handler];
    }
    getEventName(event) {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name;
    }
}
exports.AggregateRoot = AggregateRoot;
_a = IS_AUTO_COMMIT_ENABLED, _b = INTERNAL_EVENTS;
