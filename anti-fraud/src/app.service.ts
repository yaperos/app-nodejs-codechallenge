import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  static get port() {
    return Number(process.env.PORT) || 4000
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

  static get value_max() {
    return Number(process.env.VALUE_MAX) || 100
  }

  static get url_endpoint_update_status() {
    return process.env.URL_ENDPOINT_UPDATE_STATUS || "http://localhost:3000/v1/transaction/update"
  }
}
