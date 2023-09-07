import { config } from "./config/config";
import { consumerConnected } from "./kafka/kafka";
import { createServer } from "./server/server";

async function main() {
  const app = createServer();

  await consumerConnected();

  await app.listen({ port: 3000 });
}

main();
