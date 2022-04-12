import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1649754211559 implements MigrationInterface {
    name = 'initial1649754211559'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
                "token" character varying(255) NOT NULL,
                "frequency" character varying(255),
                "numberOfPayments" character varying(255),
                CONSTRAINT "PK_6e0f970ffe341139eede9006038" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."bm_subscription" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "billingModelId" character varying(255) NOT NULL,
                "subscriber" character varying(255) NOT NULL,
                "paymentToken" character varying(255) NOT NULL,
                "numberOfPayments" character varying(255) NOT NULL,
                "startTimestamp" character varying(255) NOT NULL,
                "cancelTimestamp" character varying(255) NOT NULL,
                "nextPaymentTimestamp" character varying(255) NOT NULL,
                "lastPaymentTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "PK_ea2ddb46987311b1580f9670619" PRIMARY KEY ("id")
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
                "lastSyncedBlock" integer NOT NULL,
                "isSyncing" boolean NOT NULL,
                "syncHistorical" boolean NOT NULL,
                CONSTRAINT "PK_ae4dd77ab08b3ffce5adf5742ae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."pull_payment" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "subscriptionID" character varying(255) NOT NULL,
                "paymentAmount" character varying(255) NOT NULL,
                "executionTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "PK_f7e1a32a34f74fc4255658e1f86" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription"
            ADD CONSTRAINT "FK_ea2ddb46987311b1580f9670619" FOREIGN KEY ("id") REFERENCES "public"."billing_model"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription" DROP CONSTRAINT "FK_ea2ddb46987311b1580f9670619"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."pull_payment"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."contract_event"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."bm_subscription"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."billing_model"
        `);
    }

}
