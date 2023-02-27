import { MigrationInterface, QueryRunner } from 'typeorm'

export class recurringPPType1677501780787 implements MigrationInterface {
  name = 'recurringPPType1677501780787'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD "recurringPPType" character varying(255)`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP COLUMN "recurringPPType"`,
    )
  }
}
