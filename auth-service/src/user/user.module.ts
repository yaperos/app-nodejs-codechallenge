import {Module, OnModuleInit} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {PrismaModule} from "../prisma/prisma.module";
import {PrismaUserRepo} from "./infraestructure/repos/PrismaUserRepo";
import {USER_REPO} from "./domain/user.repo";
import {UserUseCases} from "./application/user.usecases";
import {UserController} from "./infraestructure/controller/user.controller";
import {PrismaService} from "../prisma/prisma.service";

export const useCases = [
  UserUseCases,
];

@Module({
  imports: [
    PrismaModule
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
