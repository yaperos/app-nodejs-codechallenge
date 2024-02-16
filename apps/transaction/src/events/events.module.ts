import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TransactionService } from '../transaction.service';
import { PrismaService } from '@app/prisma';

@Module({
  imports: [],
  providers: [TransactionService, PrismaService],
  controllers: [EventsController],
})
export class EventsModule {}
