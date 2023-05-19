import {Module, OnModuleInit} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
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
import {AuthUserHandler} from "./application/auth-user/auth-user.handler";
import {AuthUserUseCase} from "./application/auth-user/auth-user.usecase";
import {AuthVerifyUseCase} from "./application/auth-verify/auth-verify.usecase";
import {AuthVerifyCommand} from "./application/auth-verify/auth-verify.cmd";
import {AuthVerifyHandler} from "./application/auth-verify/auth-verify.handler";

export const useCases = [
  CreateUserUseCase,
  AuthUserUseCase,
  AuthVerifyUseCase
];
export const CommandHandlers = [
  CreateUserHandler,
  AuthUserHandler,
  AuthVerifyHandler
];


@Module({
  imports: [
    EventBusModule,
    CqrsModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
