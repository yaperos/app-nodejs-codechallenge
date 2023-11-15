import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  host: process.env.KAFKA_HOST || 'localhost:9092',
  groupId: process.env.KAFKA_GROUP_ID || 'default-group-id',
}));
