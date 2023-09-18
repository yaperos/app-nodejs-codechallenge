export interface DatabaseInterface {
  srv?: string;
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
  dbAuthSource: string;
}
