import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDataMigration1697486543678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO public."transaction_status" (id,name) values (1, 'Pending')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transaction_status" (id,name) values (2, 'Approved')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transaction_status" (id,name) values (3, 'Rejected')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transaction_type" (id,name) values (1, 'In')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transaction_type" (id,name) values (2, 'Out')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transfer_type" (id,name) values (1, 'Individual transfer')`,
    );

    await queryRunner.query(
      `INSERT INTO public."transfer_type" (id,name) values (2, 'Collective transfer')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`delete from public."transaction_status"`);

    await queryRunner.query(`delete from public."transaction_type"`);

    await queryRunner.query(`delete from public."transfer_type"`);
  }
}
