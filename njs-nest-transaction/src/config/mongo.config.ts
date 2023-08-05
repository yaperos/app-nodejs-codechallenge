import { registerAs } from "@nestjs/config";

export default registerAs("mongo", () => ({
  uri: process.env.MONGO_URI,
  dbName: process.env.MONGO_DB_NAME,
}));
