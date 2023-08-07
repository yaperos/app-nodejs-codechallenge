import { registerAs } from "@nestjs/config";

export default registerAs("kafka", () => ({
  brokers: process.env.KAFKA_BROKERS || "kafka1:9092,kafka2:9092,kafka3:9092",
}));
