import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  static get port() {
    return Number(process.env.PORT) || 4000;
  }

  static get kafka_broker() {
    return process.env.KAFKA_BROKER || 'localhost:9092';
  }

  static get kafka_topic() {
    return process.env.KAFKA_TOPIC || 'transaction';
  }

  static get kafka_topic_status() {
    return process.env.KAFKA_TOPIC_STATUS || 'transaction-status';
  }

  static get value_max() {
    return Number(process.env.VALUE_MAX) || 1000;
  }

  static get endpoint_jaeger() {
    return process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
  }

  static get endpoint_grpc() {
    return process.env.JAEGER_GRCP || 'http://localhost:4317';
  }
}
