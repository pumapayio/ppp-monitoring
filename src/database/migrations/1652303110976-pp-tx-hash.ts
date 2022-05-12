import {MigrationInterface, QueryRunner} from "typeorm";

export class ppTxHash1652303110976 implements MigrationInterface {
    name = 'ppTxHash1652303110976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pull_payment"
            ADD "transactionHash" character varying(66) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pull_payment" DROP COLUMN "transactionHash"
        `);
    }

}
