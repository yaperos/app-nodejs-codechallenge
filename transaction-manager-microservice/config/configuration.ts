export default () => ({
	port: parseInt(process.env.API_PORT) || 3000,
	broker: process.env.KAFKA_BROKER || 'localhost:9092'
});