import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class transaction1690500730506 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "transactionExternalId",
                        type: "varchar",
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: "accountExternalIdDebit",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "accountExternalIdCredit",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "tranferTypeId",
                        type: "bigint",
                        isNullable: false
                    },
                    {
                        name: "tranferStatusId",
                        type: "bigint",
                        isNullable: true,
                        default:1
                    },
                    {
                        name: "value",
                        type: "bigint",
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

        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                name: "tranfer_type_id_find",
                columnNames: ["tranferTypeId"],
                referencedTableName: 'tranfer_types',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )

        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                name: "tranfer_type_status_id_find",
                columnNames: ["tranferStatusId"],
                referencedTableName: 'tranfer_status',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
