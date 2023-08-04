import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { generateTransactionType } from '../seeds/TransactionTypeSeeds';
import { TTransactionTypeFields } from '../models/transaction/transactionType/TTransactionType';

export class transactionType1690500721637 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tranfer_types",
                columns: [
                    {
                        name: "id",
                        type: "bigint",
                        isPrimary: true,
                        generationStrategy: 'increment'
                    },
                    {
                        name: "name",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    }
                ],
            }),
            true,
        )

        await queryRunner.commitTransaction().then(async () => {
            await queryRunner.startTransaction().then(async () =>{
                await queryRunner.connection.createQueryBuilder()
                    .insert()
                    .into('tranfer_types', TTransactionTypeFields)
                    .values(generateTransactionType())
                    .execute();
            })
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
