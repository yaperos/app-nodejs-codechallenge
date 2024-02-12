import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1644692171488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            CREATE TABLE IF NOT EXISTS public.transaction (
                transactionexternalid uuid NOT NULL,
                accountexternaliddebit uuid,
                accountexternalidcredit uuid,
                transactiontypeid integer,
                value numeric(18,2),
                transactionstatusid integer DEFAULT 1,
                createdat timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (transactionexternalid)
            );
            
            CREATE TABLE IF NOT EXISTS public.transaction_status (
                id integer NOT NULL,
                name character varying(200),
                PRIMARY KEY (id)
            );
            
            CREATE TABLE IF NOT EXISTS public.transaction_type (
                id integer NOT NULL,
                name character varying(200),
                PRIMARY KEY (id)
            );
            
            CREATE SEQUENCE IF NOT EXISTS public.transactionstatus_id_seq
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
                
            CREATE SEQUENCE IF NOT EXISTS public.transactiontype_id_seq
                START WITH 1
                INCREMENT BY 1
                NO MINVALUE
                NO MAXVALUE
                CACHE 1;
                
            ALTER TABLE ONLY public.transaction_status
                ALTER COLUMN id SET DEFAULT nextval('public.transactionstatus_id_seq');
                
            ALTER TABLE ONLY public.transaction_type
                ALTER COLUMN id SET DEFAULT nextval('public.transactiontype_id_seq');
                
            ALTER TABLE ONLY public.transaction
                ADD CONSTRAINT transaction_transactionstatusid_fkey FOREIGN KEY (transactionstatusid) REFERENCES public.transaction_status (id);
                
            ALTER TABLE ONLY public.transaction
                ADD CONSTRAINT transaction_transactiontypeid_fkey FOREIGN KEY (transactiontypeid) REFERENCES public.transaction_type (id);
        `);

    await queryRunner.query(`
            INSERT INTO public.transaction_status (id, name) VALUES (1, 'pending');
            INSERT INTO public.transaction_status (id, name) VALUES (2, 'approved');
            INSERT INTO public.transaction_status (id, name) VALUES (3, 'rejected');
            
            INSERT INTO public.transaction_type (id, name) VALUES (1, 'transaction_type_1');
            INSERT INTO public.transaction_type (id, name) VALUES (2, 'transaction_type_2');
            INSERT INTO public.transaction_type (id, name) VALUES (3, 'transaction_type_3');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS public.transaction CASCADE;
            DROP TABLE IF EXISTS public.transaction_status CASCADE;
            DROP TABLE IF EXISTS public.transaction_type CASCADE;
            DROP SEQUENCE IF EXISTS public.transactionstatus_id_seq CASCADE;
            DROP SEQUENCE IF EXISTS public.transactiontype_id_seq CASCADE;
        `);
  }
}
