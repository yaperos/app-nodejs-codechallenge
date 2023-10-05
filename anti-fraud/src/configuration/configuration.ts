export default () => ({
    server:{
        dns: process.env.DNS
    },
    kafka:{
        port: process.env.KAFKA_PORT
    },
    postgres:{
        port: process.env.POSTGRES_PORT,
        db: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        pass:  process.env.POSTGRES_PASS 
    },
    redis:{
        port: process.env.REDIS_PORT
    }
})