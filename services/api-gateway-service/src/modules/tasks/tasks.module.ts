import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
