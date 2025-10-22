import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1737486000000 implements MigrationInterface {
  name = 'AddPerformanceIndexes1737486000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status_created_at
      ON transactions (status, created_at DESC)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_source_account_created
      ON transactions (source_account_id, created_at DESC)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_target_account_created
      ON transactions (target_account_id, created_at DESC)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_antifraud_status_score
      ON transactions (antifraud_status, antifraud_score)
      WHERE antifraud_checked_at IS NOT NULL AND deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_idempotency_key_active
      ON transactions (idempotency_key)
      WHERE idempotency_key IS NOT NULL AND deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_amount_range
      ON transactions (amount)
      WHERE status IN ('PENDING', 'PROCESSING', 'COMPLETED') AND deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_listing
      ON transactions (created_at DESC, status, amount)
      INCLUDE (id, source_account_id, target_account_id, currency)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_failed_reason
      ON transactions (failure_reason, created_at DESC)
      WHERE status = 'FAILED' AND deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_created_at_brin
      ON transactions USING BRIN (created_at)
      WITH (pages_per_range = 128);
    `);

    await queryRunner.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_id_hash
      ON transactions USING HASH (id);
    `);

    await queryRunner.query(`ANALYZE transactions;`);

    const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
    for (const status of statuses) {
      await queryRunner.query(`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_transactions_status_${status.toLowerCase()}
        ON transactions (created_at DESC)
        WHERE status = '${status}' AND deleted_at IS NULL;
      `);
    }

    await queryRunner.query(`
      COMMENT ON TABLE transactions IS
      'High-volume transaction table. Consider partitioning by created_at for >100M records. Indexes optimized for: status queries, account queries, antifraud checks, and time-series analysis.';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_status_created_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_source_account_created;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_target_account_created;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_antifraud_status_score;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_idempotency_key_active;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_amount_range;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_listing;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_failed_reason;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_created_at_brin;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_id_hash;`);

    const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'];
    for (const status of statuses) {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_transactions_status_${status.toLowerCase()};`);
    }

    await queryRunner.query(`COMMENT ON TABLE transactions IS NULL;`);
  }
}