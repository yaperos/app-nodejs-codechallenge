"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Saga = void 0;
require("reflect-metadata");
const constants_1 = require("./constants");
/**
 * Decorator that marks a class as a Nest saga. Sagas may listen and react to 1..N events.
 *
 * @see https://docs.nestjs.com/recipes/cqrs#sagas
 */
const Saga = () => {
    return (target, propertyKey) => {
        const properties = Reflect.getMetadata(constants_1.SAGA_METADATA, target.constructor) || [];
        Reflect.defineMetadata(constants_1.SAGA_METADATA, [...properties, propertyKey], target.constructor);
    };
};
exports.Saga = Saga;
