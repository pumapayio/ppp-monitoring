import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1649849356791 implements MigrationInterface {
    name = 'initial1649849356791'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "public"."pull_payment" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "bmSubscriptionId" character varying(255) NOT NULL,
                "paymentAmount" character varying(255) NOT NULL,
                "executionTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "PK_f7e1a32a34f74fc4255658e1f86" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."bm_subscription" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "bmSubscriptionId" character varying(255) NOT NULL,
                "billingModelId" character varying(255) NOT NULL,
                "subscriber" character varying(255) NOT NULL,
                "paymentToken" character varying(255) NOT NULL,
                "numberOfPayments" character varying(255),
                "startTimestamp" character varying(255),
                "cancelTimestamp" character varying(255),
                "nextPaymentTimestamp" character varying(255),
                "lastPaymentTimestamp" character varying(255),
                CONSTRAINT "UQ_ca8fa48f33d9f4a6413c8b78d51" UNIQUE ("bmSubscriptionId"),
                CONSTRAINT "PK_ea2ddb46987311b1580f9670619" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."billing_model" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "billingModelId" character varying(255) NOT NULL,
                "payee" character varying(255) NOT NULL,
                "name" character varying(255) NOT NULL,
                "amount" character varying(255) NOT NULL,
                "sellingToken" character varying(255) NOT NULL,
                "settlementToken" character varying(255) NOT NULL,
                "frequency" character varying(255),
                "numberOfPayments" character varying(255),
                CONSTRAINT "UQ_2e6e39d90689d350eb98f5c6223" UNIQUE ("billingModelId"),
                CONSTRAINT "PK_6e0f970ffe341139eede9006038" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."contract_event_syncstatus_enum" AS ENUM(
                'Unprocessed',
                'ProcessingPastEvents',
                'ProcessingFutureEvents',
                'Processed'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."contract_event" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "eventName" character varying(255) NOT NULL,
                "topic" character varying(255) NOT NULL,
                "contractName" character varying(255) NOT NULL,
                "address" character varying(42) NOT NULL,
                "abi" character varying NOT NULL,
                "networkId" character varying NOT NULL,
                "syncStatus" "public"."contract_event_syncstatus_enum" NOT NULL DEFAULT 'Unprocessed',
                "syncHistorical" boolean NOT NULL,
                "lastSyncedBlock" integer NOT NULL,
                "lastSyncedTxHash" character varying(66),
                CONSTRAINT "PK_ae4dd77ab08b3ffce5adf5742ae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."pull_payment"
            ADD CONSTRAINT "FK_ecfe86d1e0eb32e864b311fc25a" FOREIGN KEY ("bmSubscriptionId") REFERENCES "public"."bm_subscription"("bmSubscriptionId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription"
            ADD CONSTRAINT "FK_3972833ba03ebd2165cee8c3073" FOREIGN KEY ("billingModelId") REFERENCES "public"."billing_model"("billingModelId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription" DROP CONSTRAINT "FK_3972833ba03ebd2165cee8c3073"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."pull_payment" DROP CONSTRAINT "FK_ecfe86d1e0eb32e864b311fc25a"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."contract_event"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."contract_event_syncstatus_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."billing_model"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."bm_subscription"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."pull_payment"
        `);
    }

}
