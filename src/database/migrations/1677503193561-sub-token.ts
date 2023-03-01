import { MigrationInterface, QueryRunner } from 'typeorm'

export class subToken1677503193561 implements MigrationInterface {
  name = 'subToken1677503193561'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD "token" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD "paymentAmount" character varying(255)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" DROP COLUMN "paymentAmount"`,
    )
    await queryRunner.query(`ALTER TABLE "bm_subscription" DROP COLUMN "token"`)
  }
}
