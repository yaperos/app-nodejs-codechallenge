import "dotenv/config";

import { proxyKafkaEvents, syncKafkaTopics } from "./kafka";
import { proxyHttpEvents } from "./koa";
import { migrateDatabase } from "./migration";

const main = async () => {
  await migrateDatabase();
  await syncKafkaTopics();

  proxyKafkaEvents();
  proxyHttpEvents();
};

main();
