import express from "express";
import http from "http";
import { Configuration } from "../config";
import { ServerLogger } from "./infrastructure/Logger";
import { consumer, producer } from "./infrastructure/kafka";
import { consumerKafka } from "../api/infrastructure/kafka/consumerKafka";

export class Server {
  private readonly express: express.Application;
  private http: http.Server | any;

  constructor(
    private router: express.Router,
    private config: Configuration,
    private logger: ServerLogger
  ) {
    this.express = express();
    this.express.use(this.logger.stream());
    this.express.use(this.router);
  }

  public start = async (): Promise<void> => {
    producer.connect();
    this.logger.info("Contecting to kafka producer sucess");
    consumer.connect();
    await consumerKafka();
    this.logger.info("Contecting to kafka consumer sucess");
    return await new Promise<void>((resolve) => {
      this.http = this.express.listen(this.config.PORT, () => {
        this.logger.info("Application running on port " + this.config.PORT);
        resolve();
      });
    });
  };
}
