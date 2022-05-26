import {MigrationInterface, QueryRunner} from "typeorm";

export class cancelledBy1653544785003 implements MigrationInterface {
    name = 'cancelledBy1653544785003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bm_subscription" ADD "cancelledBy" character varying(42)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bm_subscription" DROP COLUMN "cancelledBy"`);
    }

}
