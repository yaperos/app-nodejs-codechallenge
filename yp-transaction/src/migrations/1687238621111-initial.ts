import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Initial1687238621111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "transactions",
                columns: [
                    {
                        name: "transactionExternalId",
                        type: "char",
                        isPrimary: true,
                        isNullable: false,
                        isGenerated: false
                    },
                    {
                        name: "accountExternalIdDebit",
                        type: "char",
                        isNullable: false
                    },
                    {
                        name: "accountExternalIdCredit",
                        type: "char",
                        isNullable: false
                    },
                    {
                        name: "tranferTypeId",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "value",
                        type: "double precision",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "int",
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "createdAtTimestamp",
                        type: "integer",
                        isNullable: false
                    },
                    {
                        name: "updatedAt",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "updatedAtTimestamp",
                        type: "integer",
                        isNullable: true
                    },
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("transactions");
    }

}
