import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1697482962190 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.transfer_type (
                created_at timestamp NOT NULL DEFAULT now(),
                updated_at timestamp NOT NULL DEFAULT now(),
                id serial4 NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "PK_e8079532c19bb535c33902388f1" PRIMARY KEY (id)
            );`,
    );

    await queryRunner.query(
      `CREATE TABLE public.transaction_type (
                created_at timestamp NOT NULL DEFAULT now(),
                updated_at timestamp NOT NULL DEFAULT now(),
                id serial4 NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "PK_e4e15bcea926d360cfeea703c36" PRIMARY KEY (id)
            );`,
    );

    await queryRunner.query(
      `CREATE TABLE public.transaction_status (
                created_at timestamp NOT NULL DEFAULT now(),
                updated_at timestamp NOT NULL DEFAULT now(),
                id serial4 NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY (id)
            );`,
    );

    await queryRunner.query(
      `CREATE TABLE public."transaction" (
                created_at timestamp NOT NULL DEFAULT now(),
                updated_at timestamp NOT NULL DEFAULT now(),
                id bigserial NOT NULL,
                transaction_external_id uuid NOT NULL,
                account_external_id_debit uuid NOT NULL,
                account_external_id_credit uuid NOT NULL,
                transfer_type_id int4 NOT NULL,
                value float8 NOT NULL,
                transaction_type_id int4 NOT NULL,
                transaction_status_id int4 NOT NULL,
                CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY (id)
            );`,
    );

    await queryRunner.query(
      `ALTER TABLE public."transaction" ADD CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f" FOREIGN KEY (transfer_type_id) REFERENCES public.transfer_type(id);`,
    );

    await queryRunner.query(
      `ALTER TABLE public."transaction" ADD CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca" FOREIGN KEY (transaction_type_id) REFERENCES public.transaction_type(id);`,
    );

    await queryRunner.query(
      `ALTER TABLE public."transaction" ADD CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY (transaction_status_id) REFERENCES public.transaction_status(id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE public."transaction" DROP CONSTRAINT "FK_df972d66ba089168f1ffb0831ca"`,
    );

    await queryRunner.query(
      `ALTER TABLE public."transaction" DROP CONSTRAINT "FK_98271e4a83052aeca9aa11fd3ca"`,
    );

    await queryRunner.query(
      `ALTER TABLE public."transaction" DROP CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f"`,
    );

    await queryRunner.query(`DROP TABLE public."transaction_status"`);

    await queryRunner.query(`DROP TABLE public."transaction_type"`);

    await queryRunner.query(`DROP TABLE public."transfer_type"`);

    await queryRunner.query(`DROP TABLE public."transaction"`);
  }
}
