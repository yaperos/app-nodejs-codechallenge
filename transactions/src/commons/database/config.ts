export function databaseConfig() {
  return {
    database: {
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + './../../**/*.entity{.ts,.js}'],
      synchronize: false,
    },
  };
}
