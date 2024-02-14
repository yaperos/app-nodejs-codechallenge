import { NestFactory } from "@nestjs/core";
import AppModule from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const port = configService.get<number>("APP_PORT", 3000);

  await app.listen(port);
  Logger.log(`Run app in http://localhost:${port}`);
};

(async () => {
  await bootstrap();
})();
