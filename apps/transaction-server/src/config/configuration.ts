export default () => ({
    KAFKA_BROKERS : process.env.KAFKA_BROKERS.split(','),
    DATABASE_URL: process.env.DATABASE_URL,
});
