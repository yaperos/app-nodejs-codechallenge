import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepo } from './infraestructure/repos/PrismaUserRepo';
import { USER_REPO } from './domain/user.repo';
import { UserController } from './infraestructure/controller/user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUsecase } from './application/create-user/create-user.usecase';
import { CreateUserHandler } from './application/create-user/create-user.handler';

export const useCases = [CreateUserUsecase];
export const commandHandlers = [CreateUserHandler];

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-service-consumer',
          },
        },
      },
    ]),
    PrismaModule,
    CqrsModule,
  ],
  providers: [
    ...useCases,
    ...commandHandlers,
    {
      useClass: PrismaUserRepo,
      provide: USER_REPO,
    },
    PrismaService,
  ],
  controllers: [UserController],
  exports: [...useCases],
})
export class UserModule {}
