import {EntityTarget} from "typeorm";

export interface EntityRepositoryPort {
    save<T>(entity, entityTarget: EntityTarget<T>): Promise<T>
    update<T>(entity, entityTarget: EntityTarget<T>): Promise<T>;
    delete<T>(entity, entityTarget: EntityTarget<T>): Promise<T>;
    getByFields<T>(fields: {}, entityTarget: EntityTarget<T>): Promise<T>;
}