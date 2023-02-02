import { MigrationInterface, QueryRunner } from "typeorm";

export class InitData1675305542690 implements MigrationInterface {
    name = 'InitData1675305542690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.users (username, password, email, active) VALUES ('yape', '$2b$10$iWoLmO3I4JyXMJlUrAQ1h.A5hsZdgBi367tOftd5Vne1Ihapc.s0C', 'yape@bcp.com.pe', true);`);
        await queryRunner.query(`INSERT INTO public.users (username, password, email, active) VALUES ('bcp', '$2b$10$iWoLmO3I4JyXMJlUrAQ1h.A5hsZdgBi367tOftd5Vne1Ihapc.s0C', 'bcp@bcp.com.pe', true);`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
