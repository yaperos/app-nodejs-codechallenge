import {
  asClass,
  createContainer,
  asFunction,
  InjectionMode,
  AwilixContainer,
  asValue,
} from "awilix";
import { Server } from "./Server";
import { Router } from "./Router";
import { config } from "../config";
import { ApiRouter } from "../api/infrastructure/express/router";
import * as apiControllers from "../api/infrastructure/express/controllers";
import { createPrismaClient } from "./infrastructure/prisma";
import { PrismaTransactionRepository } from "../api/infrastructure/persistence/prisma/PrismaTransactionRepository";
import { ErrorMiddleware } from "./infrastructure/express/errorMiddleware";
import { ServerLogger } from "./infrastructure/Logger";
import * as apiServices from "../api/application";
import { consumer, createKafka, producer } from "./infrastructure/kafka";
import { consumerKafka } from "../api/infrastructure/kafka/consumerKafka";

export class Cointainer {
  private readonly container: AwilixContainer;

  constructor() {
    this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });

    this.register();
  }

  register(): void {
    this.container
      .register({
        server: asClass(Server).singleton(),
        router: asFunction(Router).singleton(),
        config: asValue(config),
        logger: asClass(ServerLogger).singleton(),
        db: asFunction(createPrismaClient).singleton(),
        kafka: asFunction(createKafka).singleton(),
        producr: asValue(producer),
        consumer: asValue(consumer),
        consumerkafka: asFunction(consumerKafka).singleton(),
      })
      .register({
        errorMiddleware: asClass(ErrorMiddleware).singleton(),
        apiRouter: asFunction(ApiRouter).singleton(),
      })
      .register({
        indexController: asClass(apiControllers.IndexController).singleton(),
      })
      .register({
        createTransactionController: asClass(
          apiControllers.CreateTransactionController
        ).singleton(),
        createTransactionService: asClass(
          apiServices.CreateTransactionService
        ).singleton(),
        getTransactionService: asClass(
          apiServices.GetTransactionService
        ).singleton(),
        getTransactionController: asClass(
          apiControllers.GetTransactionController
        ).singleton(),
        transactionRepository: asClass(PrismaTransactionRepository).singleton(),
      });
  }

  public invoke(): AwilixContainer {
    return this.container;
  }
}
