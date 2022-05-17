import {MigrationInterface, QueryRunner} from "typeorm";

export class subRemainingNoOfPayments1652773013405 implements MigrationInterface {
    name = 'subRemainingNoOfPayments1652773013405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bm_subscription" RENAME COLUMN "numberOfPayments" TO "remainingNumberOfPayments"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bm_subscription" RENAME COLUMN "remainingNumberOfPayments" TO "numberOfPayments"`);
    }

}
