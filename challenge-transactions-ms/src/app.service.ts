import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  static get environment(): string {
    return process.env.ENVIRONMENT || 'LOCAL';
  }

  static get stage(): string {
    return process.env.STAGE || 'dev';
  }

  static get port(): number {
    return Number(process.env.PORT) || 3000;
  }

  static get EVENT_BRIDGE_APPOINTMENTS_CONFIG(): EventBridgeConfig {
    const {
      AWS_REGION,
      EVENT_BRIDGE_ARN,
      EVENT_BRIDGE_SOURCE_CREATE_APPOINTMENT = 'auna-app',
      EVENT_BRIDGE_DETAIL_TYPE_CREATE_APPOINTMENT = 'appointments-create',
    } = process.env;

    return {
      eventBusName: EVENT_BRIDGE_ARN,
      source: EVENT_BRIDGE_SOURCE_CREATE_APPOINTMENT,
      detailType: EVENT_BRIDGE_DETAIL_TYPE_CREATE_APPOINTMENT,
      region: AWS_REGION,
    } as EventBridgeConfig;
  }

  async onFailedToConnectToDatabase(error: Error) {
    console.error('error: ', error);
    process.exit(1);
  }
}

export class EventBridgeConfig {
  readonly source: string;

  readonly detailType: string;

  readonly eventBusName: string;

  readonly region: string;
}
