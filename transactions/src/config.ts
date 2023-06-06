import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  databaseUrl: process.env.DB_HOST,
  key: process.env.KEY,
  topic: process.env.TOPIC,
  approved_status: process.env.APPROVED_STATUS,
  rejected_status: process.env.REJECTED_STATUS,
  pending_status: process.env.PENDING_STATUS,
  created_status: process.env.CREATED_STATUS,
};
