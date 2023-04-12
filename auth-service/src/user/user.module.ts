import {Module, OnModuleInit} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {CreateUserUseCase} from "../application/create-user.usecase";
import {PrismaModule} from "../../prisma/prisma.module";

export const useCases = [
  CreateUserUseCase,
];

@Module({
  imports: [
    PrismaModule
  ],
  providers: [
    ...useCases,
  ],
  controllers: [],
})
export class UserModule {
}
