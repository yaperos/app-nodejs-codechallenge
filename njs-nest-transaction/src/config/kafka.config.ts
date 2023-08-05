import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
	host: process.env.KAFKA_BROKER_HOST || 'localhost',
	port: parseInt(process.env.KAFKA_BROKER_PORT) || 9092,
}));
