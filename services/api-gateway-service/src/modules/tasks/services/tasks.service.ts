import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { v4 } from 'uuid';
import { TaskStatus } from 'src/common/constants/task-status.enum';
import { TaskEntity } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(@Inject(CACHE_MANAGER) private cacheService: Cache) {}

  async init(retryAfter?: number, retryTimes?: number): Promise<TaskEntity> {
    const taskId = v4();
    const task = new TaskEntity(
      taskId,
      TaskStatus.PENDING,
      retryAfter,
      retryTimes,
    );

    await this.cacheService.set(`task:${taskId}`, task);

    return task;
  }

  async complete(id: string, result: any): Promise<TaskEntity> {
    // TODO: Add try catch;
    let task = await this.findOne(id);

    if (!task) {
      task = new TaskEntity(id, TaskStatus.COMPLETED);
    }

    const completedTask: TaskEntity = {
      ...task,
      retryAfter: 0,
      retryTimes: 0,
      status: TaskStatus.COMPLETED,
      result: result,
    };

    await this.cacheService.set(`task:${task.id}`, completedTask);

    return completedTask;
  }

  async findOne(id: string): Promise<TaskEntity> {
    // TODO: Add try catch;
    return await this.cacheService.get(`task:${id}`);
  }
}
