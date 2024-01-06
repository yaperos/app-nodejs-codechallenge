import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { TaskStatus } from 'src/common/constants/task-status.enum';

@ObjectType()
export class TaskEntity {
  @Field(() => ID, { description: 'Task id' })
  id: string;

  @Field(() => String, { description: 'Current task status' })
  status: TaskStatus;

  @Field(() => Int, {
    description: 'Time in seconds to retry if the task has not ended',
  })
  retryAfter: number;

  @Field(() => Int, {
    description: 'Retry times before considering the task as not found',
  })
  retryTimes: number;

  result: any;

  @Field(() => String, { description: '' })
  createdAt: string;

  constructor(
    id: string,
    status?: TaskStatus,
    retryAfter: number = 5,
    retryTimes: number = 5,
  ) {
    this.id = id;
    this.status = status;
    this.retryAfter = retryAfter;
    this.retryTimes = retryTimes;
    this.createdAt = new Date().toISOString();
  }
}
