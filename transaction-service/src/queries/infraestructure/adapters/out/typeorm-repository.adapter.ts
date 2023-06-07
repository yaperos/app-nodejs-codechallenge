import { Injectable } from "@nestjs/common";
import { EntityRepositoryPort } from "../../ports/out/entity-repository.port";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, EntityTarget, FindOneOptions, FindOptionsWhere } from "typeorm";

@Injectable()
export class TypeOrmRespositoryAdapter implements EntityRepositoryPort {

  constructor(@InjectEntityManager() private readonly entityManager: EntityManager) {

  }

  async save<T>(entity, entityTarget: EntityTarget<T>) {
    this.entityManager.connection.manager.save(entity);
    return entity;
  }

  async update<T>(entity, entityTarget: EntityTarget<T>) {
    this.entityManager.connection.manager.save(entityTarget, entity);
    return entity;
  }

  async delete<T>(entity, entityTarget: EntityTarget<T>) {
    this.entityManager.connection.manager.save(entityTarget, entity);
    return entity;
  }

  async getByFields<T>(fields: {}, entityTarget: EntityTarget<T>): Promise<T> {
    const findOptions: FindOneOptions<T> = {
      where: {
        ...fields
      } as unknown as FindOptionsWhere<T>,
    };

    const repository = this.entityManager.getRepository<T>(entityTarget);
    return repository.findOne(findOptions);
  }
}