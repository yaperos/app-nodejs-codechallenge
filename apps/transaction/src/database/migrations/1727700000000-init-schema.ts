import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1727700000000 implements MigrationInterface {
  name = 'InitSchema1727700000000';

  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE transfer_types (
        id   int PRIMARY KEY,
        name varchar(50) NOT NULL
      )`);
    // El README no define los nombres de los tipos: catálogo asumido.
    await q.query(`
      INSERT INTO transfer_types (id, name) VALUES
        (1, 'Own accounts'), (2, 'Third party'), (3, 'Interbank')`);

    await q.query(`
      CREATE TABLE transactions (
        transaction_external_id    uuid PRIMARY KEY,
        account_external_id_debit  uuid NOT NULL,
        account_external_id_credit uuid NOT NULL,
        transfer_type_id           int NOT NULL REFERENCES transfer_types(id),
        value                      numeric(18,2) NOT NULL CHECK (value > 0),
        status                     varchar(20) NOT NULL
                                   CHECK (status IN ('pending','approved','rejected')),
        created_at                 timestamptz NOT NULL DEFAULT now(),
        updated_at                 timestamptz NOT NULL DEFAULT now()
      )`);

    await q.query(`
      CREATE TABLE outbox (
        id           bigserial PRIMARY KEY,
        aggregate_id uuid NOT NULL,
        topic        varchar(100) NOT NULL,
        payload      jsonb NOT NULL,
        created_at   timestamptz NOT NULL DEFAULT now(),
        published_at timestamptz
      )`);
    // Índice parcial: el relay solo lee lo pendiente, así la tabla puede crecer sin frenarlo.
    await q.query(
      `CREATE INDEX outbox_unpublished_idx ON outbox (id) WHERE published_at IS NULL`,
    );
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE outbox`);
    await q.query(`DROP TABLE transactions`);
    await q.query(`DROP TABLE transfer_types`);
  }
}
