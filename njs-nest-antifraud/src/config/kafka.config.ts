import { registerAs } from "@nestjs/config";

export default registerAs("kafka", () => ({
  brokers: process.env.KAFKA_BROKERS || "kafka:9092,kafka:9093kafka:9094",
}));
