import {MigrationInterface, QueryRunner, Table} from "typeorm"
import {TTransactionStatusFields} from "../models/transaction/transactionStatus/TTransactionStatus";
import {generateTransactionStatus} from "../seeds/TransactionStatusSeeds";

export class transactionStatus1690500727270 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "tranfer_status",
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
                    .into('tranfer_status', TTransactionStatusFields)
                    .values(generateTransactionStatus())
                    .execute();
            })
        })
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
