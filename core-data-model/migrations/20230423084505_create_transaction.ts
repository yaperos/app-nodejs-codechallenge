import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS transaction (
      id                          SERIAL,
      uuid                        VARCHAR(36) NOT NULL,
      accountExternal_id_debit    VARCHAR(36) NOT NULL, 
      accountExternal_id_credit   VARCHAR(36) NOT NULL,
      tranfer_type                VARCHAR(36) DEFAULT 'schedule' NOT NULL,  
      value                       DOUBLE PRECISION, 
      status                      VARCHAR(36) DEFAULT 'pending' NOT NULL,
      created_at                  TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
      update_at                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL, 
      version                     BIGINT DEFAULT 0 NOT NULL, 
      PRIMARY KEY (id));
    `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    DROP TABLE IF EXISTS transaction;
    `);
}
