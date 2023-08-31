import { Configuration } from "./app/config";
import { Cointainer } from "./app/shared/Container";
import { Server } from "./app/shared/Server";

const container = new Cointainer();
const server = container.invoke().resolve<Server>("server");
const config = container.invoke().resolve<Configuration>("config");

server
  .start()
  .then(async () => {
    console.log(`Enviroment: ${config.NODE_ENV}`);
  })
  .catch((err: Error) => {
    console.log(err);
    process.exit(1);
  });
