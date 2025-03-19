import { Module } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Module({})
export class DynamoDBConfigModule {
  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION || 'us-east-1',
    });
  }
}
