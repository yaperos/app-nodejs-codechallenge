import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => {
  const brokers = (process.env.KAFKA_BROKERS || '').split(',').map(s => s.trim()).filter(Boolean);
  return {
    clientId: process.env.KAFKA_CLIENT_ID || 'app',
    groupId: process.env.KAFKA_GROUP_ID || 'app-group',
    brokers,
  };
});