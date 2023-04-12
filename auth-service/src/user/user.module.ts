import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "../prisma/prisma.module";
import {PrismaUserRepo} from "./infraestructure/repos/PrismaUserRepo";
import {USER_REPO} from "./domain/user.repo";
import {UserUseCases} from "./application/user.usecases";
import {UserController} from "./infraestructure/controller/user.controller";
import {PrismaService} from "../prisma/prisma.service";
import {ClientsModule, Transport} from "@nestjs/microservices";

export const useCases = [
  UserUseCases,
];

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
          }
        }
      }
    ]),
    PrismaModule,
  ],
  providers: [
    ...useCases,
    {
      useClass: PrismaUserRepo,
      provide: USER_REPO,
    },
    PrismaService
  ],
  controllers: [
    UserController
  ],
  exports: [
    ...useCases,
  ]
})
export class UserModule {
}
