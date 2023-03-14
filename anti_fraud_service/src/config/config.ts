interface Config {
    port: number;
    kafka: KafkaConfig;
}

interface KafkaConfig {
    host: string;
    port: number;
    groupId: string;
}

const getConfig = () => ({
    port: parseInt(process.env.ANTI_FRAUD_SERVICE_PORT, 10) || 3001,
    kafka: {
        host: process.env.KAFKA_HOST,
        port: parseInt(process.env.KAFKA_PORT, 10) || 9092,
        groupId: process.env.KAFKA_ANTI_FRAUD_GROUP_ID,
    },
});

export {
    type Config,
    type KafkaConfig,
    getConfig,
};
