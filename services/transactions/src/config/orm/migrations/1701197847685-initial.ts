import { MigrationInterface, QueryRunner } from "typeorm"

export class Initial1701197847685 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE public."transaction" (
            id UUID NOT NULL DEFAULT uuid_generate_v4(),
            account_external_id_debit varchar NOT NULL,
            account_external_id_credit varchar NOT NULL,
            transfer_type_id int4 NOT NULL,
            transaction_value NUMERIC NOT NULL,
            transaction_status_id int4 NOT NULL,
            created_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
            updated_at timestamp NOT NULL DEFAULT 'now'::text::timestamp(6) with time zone,
            CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY (id)
        );`);
        await queryRunner.query(`CREATE TABLE public.transaction_status (
            id int4 NOT NULL,
            transaction_status_name varchar NOT NULL,
            active bool NOT NULL,
            CONSTRAINT "PK_05fbbdf6bc1db819f47975c8c0b" PRIMARY KEY (id)
        );`);
        await queryRunner.query(`CREATE TABLE public.transfer_type (
            id int4 NOT NULL,
            transfer_type_name varchar NOT NULL,
            active bool NOT NULL,
            CONSTRAINT "PK_e8079532c19bb535c33902388f1" PRIMARY KEY (id)
        );`);

        await queryRunner.query(`ALTER TABLE public."transaction" ADD CONSTRAINT "FK_065ab1a8dfaf0cf5e338a1fe89f" FOREIGN KEY (transfer_type_id) REFERENCES public.transfer_type(id);`);
        await queryRunner.query(`ALTER TABLE public."transaction" ADD CONSTRAINT "FK_df972d66ba089168f1ffb0831ca" FOREIGN KEY (transaction_status_id) REFERENCES public.transaction_status(id);`);

        await queryRunner.query(`INSERT INTO transaction_status (id, transaction_status_name, active) 
        VALUES (1, 'pending', true), (2, 'approved', true), (3, 'rejected', true)`);
        await queryRunner.query(`INSERT INTO transfer_type (id, transfer_type_name, active) 
        VALUES (1, 'express', true), (2, 'scheduled', true)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM transaction_status WHERE id = 1 AND id = 2 AND id = 3`);
        await queryRunner.query(`DELETE FROM transfer_type WHERE id = 1 AND id = 2`);
    }

}
