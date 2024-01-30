import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  static get port(): number {
    return Number(process.env.PORT) || 3000
  }

  static get database_port() {
    return Number(process.env.DATABASE_PORT) || 3306
  }

  static get database_host() {
    return process.env.DATABASE_HOST || "localhost"
  }

  static get database_user() {
    return process.env.DATABASE_USER || "sergio"
  }

  static get database_pass() {
    return process.env.DATABASE_PASS || "12345"
  }

  static get database_name() {
    return process.env.DATABASE_NAME || "retodb"
  }

  static get mongo_user() {
    return process.env.MONGO_USER || "root"
  }

  static get mongo_port() {
    return Number(process.env.MONGO_PORT) || 27017
  }

  static get mongo_host() {
    return process.env.MONGO_HOST || "localhost"
  }

  static get mongo_pass() {
    return process.env.MONGO_PASS || "12345"
  }

  static get mongo_name() {
    return process.env.MONGO_NAME || "db"
  }

  static get kafka_broker() {
    return process.env.KAFKA_BROKER || "localhost:9092"
  }

  static get kafka_topic() {
    return process.env.KAFKA_TOPIC || "transaction"
  }

  static get kafka_topic_status() {
    return process.env.KAFKA_TOPIC_STATUS || "transaction-status"
  }
}
