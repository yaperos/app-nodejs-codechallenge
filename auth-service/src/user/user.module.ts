import {Module, OnModuleInit} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepo } from './infraestructure/repos/PrismaUserRepo';
import { USER_REPO } from './domain/user.repo';
import { UserController } from './infraestructure/controller/user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {CommandBus, CqrsModule, EventBus} from "@nestjs/cqrs";
import {CreateUserUseCase} from "./application/create-user/create-user.usecase";
import {CreateUserHandler} from "./application/create-user/create-user.handler";
import {EventBusModule} from "../event-bus/event-bus.module";

export const useCases = [
  CreateUserUseCase
];
export const CommandHandlers = [
  CreateUserHandler
];


@Module({
  imports: [
    EventBusModule,
    CqrsModule,
    PrismaModule,
  ],
  providers: [
    ...useCases,
    ...CommandHandlers,
    {
      useClass: PrismaUserRepo,
      provide: USER_REPO,
    },
    PrismaService,
  ],
  controllers: [UserController],
  //exports: [...useCases],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly command$: CommandBus,
    private readonly event$: EventBus
  ) { }

  onModuleInit() {
    //this.event$.register(EventHa)
    this.command$.register(CommandHandlers);
  }
}
