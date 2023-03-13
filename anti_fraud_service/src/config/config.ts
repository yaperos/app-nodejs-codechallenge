interface Config {
    port: number;
    kafka: KafkaConfig;
}

interface KafkaConfig {
    broker: string;
    groupId: string;
}

const getConfig = () => ({
    port: parseInt(process.env.PORT, 10) || 3001,
    kafka: {
        broker: process.env.KAFKA_BROKER,
        groupId: process.env.KAFKA_GROUP_ID,
    },
});

export {
    type Config,
    type KafkaConfig,
    getConfig,
};
