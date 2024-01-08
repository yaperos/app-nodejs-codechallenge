import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { TaskEntity } from './task.entity';

export function AbstractTaskEntity<T>(ResultType: Type<T>): any {
  @ObjectType()
  abstract class TaskClass extends TaskEntity {
    @Field(() => ResultType, { nullable: true })
    result: T;
  }

  return TaskClass;
}
