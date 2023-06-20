import { DataSource } from "typeorm"
import env from "../env/env";

export default new DataSource({
    type: "postgres",
    host: env.Db.Host,
    port: env.Db.Port,
    username: env.Db.Username,
    password: env.Db.Password,
    database: env.Db.Database,
    synchronize: env.Db.Sync,
    logging: env.Db.Logging,
    migrationsRun: true,
    entities: [__dirname + '/../../models/**/*.schema{.ts,.js}'],
    migrations: [__dirname + '/../../../migrations/**/*-*.{.ts,.js}']
});