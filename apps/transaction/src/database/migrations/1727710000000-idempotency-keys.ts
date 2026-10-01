import { MigrationInterface, QueryRunner } from 'typeorm';

export class IdempotencyKeys1727710000000 implements MigrationInterface {
  name = 'IdempotencyKeys1727710000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE idempotency_keys (
        key                     varchar(255) PRIMARY KEY,
        request_hash            char(64) NOT NULL,
        transaction_external_id uuid NOT NULL REFERENCES transactions(transaction_external_id),
        created_at              timestamptz NOT NULL DEFAULT now()
      )`);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE idempotency_keys`);
  }
}
