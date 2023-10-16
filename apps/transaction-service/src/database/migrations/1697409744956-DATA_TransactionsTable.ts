import { MigrationInterface, QueryRunner } from 'typeorm';

export class DATATransactionsTable1697409744956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_status')
      .values({
        name: 'PENDING',
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_status')
      .values({
        name: 'APPROVED',
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_status')
      .values({
        name: 'REJECTED',
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_type')
      .values({
        name: 'TRANSACTION_TYPE_1',
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_type')
      .values({
        name: 'TRANSACTION_TYPE_2',
      })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('transaction_type')
      .values({
        name: 'TRANSACTION_TYPE_3',
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_type')
      .where('name= :name', { name: 'TRANSACTION_TYPE_3' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_type')
      .where('name= :name', { name: 'TRANSACTION_TYPE_2' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_type')
      .where('name= :name', { name: 'TRANSACTION_TYPE_1' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_status')
      .where('name= :name', { name: 'REJECTED' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_status')
      .where('name= :name', { name: 'APPROVED' })
      .execute();

    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('transaction_status')
      .where('name= :name', { name: 'PENDING' })
      .execute();
  }
}
