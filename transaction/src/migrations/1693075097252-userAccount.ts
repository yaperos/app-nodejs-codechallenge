import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAccount1693075097252 implements MigrationInterface {
  name = 'UserAccount1693075097252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f89ab1f917141afeface36ecc8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_accounts" ADD CONSTRAINT "FK_20577a7d9918c21ad800d71a8a1" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_accounts" DROP CONSTRAINT "FK_20577a7d9918c21ad800d71a8a1"`,
    );
    await queryRunner.query(`DROP TABLE "users_accounts"`);
  }
}
