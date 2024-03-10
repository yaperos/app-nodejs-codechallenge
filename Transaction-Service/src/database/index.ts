import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { POSTGRES_USER, DATABASE_HOST, POSTGRES_PASSWORD } = process.env

const pool = new Pool({
  user: POSTGRES_USER,
  host: DATABASE_HOST,
  password: POSTGRES_PASSWORD,
  port: 5002,
});

export default pool;