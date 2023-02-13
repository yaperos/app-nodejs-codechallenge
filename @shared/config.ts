export const configOptions = () => ({
    redis: {
        url: process.env.REDIS_HOST ?? 'redis://localhost:6379'
    },
    database: {
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.USERNAME ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      name: process.env.DB_NAME ?? 'main',
    },
    kafka: {
      brokers: ['localhost:9091'],
    }
});