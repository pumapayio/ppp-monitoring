import { MigrationInterface, QueryRunner } from 'typeorm'

export class merchantNameUpdates1652184016930 implements MigrationInterface {
  name = 'merchantNameUpdates1652184016930'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "bm_subscription"
            ADD "uniqueReference" character varying(255) NOT NULL
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model"
            ADD "merchantName" character varying(255)
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model"
            ADD "merchantURL" character varying(255)
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model"
            ADD "uniqueReference" character varying(255) NOT NULL
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_8f47594f3011983a111682ed51" ON "bm_subscription" ("uniqueReference")
        `)
    await queryRunner.query(`
            CREATE INDEX "IDX_7b41af66aba83a881e29fbfc02" ON "billing_model" ("uniqueReference")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7b41af66aba83a881e29fbfc02"
        `)
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8f47594f3011983a111682ed51"
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model" DROP COLUMN "uniqueReference"
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model" DROP COLUMN "merchantURL"
        `)
    await queryRunner.query(`
            ALTER TABLE "billing_model" DROP COLUMN "merchantName"
        `)
    await queryRunner.query(`
            ALTER TABLE "bm_subscription" DROP COLUMN "uniqueReference"
        `)
  }
}
