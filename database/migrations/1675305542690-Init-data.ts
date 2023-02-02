import { MigrationInterface, QueryRunner } from "typeorm";

export class InitData1675305542690 implements MigrationInterface {
    name = 'InitData1675305542690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.users (username, password, email, active) VALUES ('yape', '123456', 'yape@bcp.com.pe', true);`);
        await queryRunner.query(`INSERT INTO public.users (username, password, email, active) VALUES ('bcp', '123456', 'bcp@bcp.com.pe', true);`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
