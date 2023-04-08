import { DataSource } from "typeorm";
import { IDatabaseService } from "./Database.interface";

export class PostgreSQLDatabaseService implements IDatabaseService {
  private static _instance: PostgreSQLDatabaseService;
  private readonly _dataSource: DataSource;

  public get dataSource(): DataSource {
    return this._dataSource;
  }

  constructor() {
    this._dataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? ""),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      // TODO: Add entities
      entities: [],
    });
  }

  static getInstance() {
    if (PostgreSQLDatabaseService._instance)
      return PostgreSQLDatabaseService._instance;

    PostgreSQLDatabaseService._instance = new PostgreSQLDatabaseService();
    return PostgreSQLDatabaseService._instance;
  }

  async connect() {
    try {
      await this._dataSource.initialize();
      console.info("Data Source has been initialized!");
    } catch (error) {
      console.error("Data Source connection error", error);
      process.exit(1);
    }
  }
}
