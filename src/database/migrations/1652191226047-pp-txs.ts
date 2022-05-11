import { MigrationInterface, QueryRunner } from 'typeorm'

export class ppTxs1652191226047 implements MigrationInterface {
  name = 'ppTxs1652191226047'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pull_payment"
            ADD "executionAmount" character varying(255) NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "pull_payment"
            ADD "receivingAmount" character varying(255) NOT NULL
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "pull_payment" DROP COLUMN "receivingAmount"
        `)
    await queryRunner.query(`
            ALTER TABLE "pull_payment" DROP COLUMN "executionAmount"
        `)
  }
}
