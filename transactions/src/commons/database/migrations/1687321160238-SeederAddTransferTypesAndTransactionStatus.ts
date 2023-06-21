import { MigrationInterface, QueryRunner } from 'typeorm';

import { TABLES } from '../constants';

const TRANSFER_TYPES = ['IMPS', 'NEFT', 'RTGS'];
const TRANSACTION_STATUSES = ['PENDING', 'APPROVED', 'REJECTED'];

export class SeederAddTransferTypesAndTransactionStatus1687321160238
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      TRANSFER_TYPES.map((name, index) =>
        queryRunner.query(
          `INSERT INTO ${TABLES.TRANSFER_TYPE} (id, name) VALUES (${
            index + 1
          },'${name}');`,
        ),
      ),
    );

    await Promise.all(
      TRANSACTION_STATUSES.map((name, index) =>
        queryRunner.query(
          `INSERT INTO ${TABLES.TRANSACTION_STATUS} (id, name) VALUES (${
            index + 1
          },'${name}');`,
        ),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(
      TRANSFER_TYPES.map((name, index) =>
        queryRunner.query(
          `DELETE FROM ${TABLES.TRANSFER_TYPE} WHERE id = ${index + 1};`,
        ),
      ),
    );

    await Promise.all(
      TRANSACTION_STATUSES.map((name, index) =>
        queryRunner.query(
          `DELETE FROM ${TABLES.TRANSACTION_STATUS} WHERE id = ${index + 1};`,
        ),
      ),
    );
  }
}
