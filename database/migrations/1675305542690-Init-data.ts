import { MigrationInterface, QueryRunner } from "typeorm";

export class InitData1675305542690 implements MigrationInterface {
    name = 'InitData1675305542690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO public.users (id, username, password, email, active) VALUES ('9bc6b4ca-5429-4e8a-ba4f-c356c96a3ed8', 'yape', '$2b$10$iWoLmO3I4JyXMJlUrAQ1h.A5hsZdgBi367tOftd5Vne1Ihapc.s0C', 'yape@bcp.com.pe', true);`);
        await queryRunner.query(`INSERT INTO public.users (id, username, password, email, active) VALUES ('1a0f4d5d-dd59-40e7-bf36-4743e051808c', 'bcp', '$2b$10$iWoLmO3I4JyXMJlUrAQ1h.A5hsZdgBi367tOftd5Vne1Ihapc.s0C', 'bcp@bcp.com.pe', true);`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
