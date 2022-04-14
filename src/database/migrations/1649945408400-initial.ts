import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1649945408400 implements MigrationInterface {
    name = 'initial1649945408400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "public"."pull_payment" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "billingModelId" character varying(255) NOT NULL,
                "bmSubscriptionId" character varying(255) NOT NULL,
                "pullPaymentId" character varying(255) NOT NULL,
                "contractAddress" character varying(42) NOT NULL,
                "networkId" character varying(42) NOT NULL,
                "paymentAmount" character varying(255) NOT NULL,
                "executionTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "UQ_006860fd9a0bb612df1bcee4dac" UNIQUE (
                    "billingModelId",
                    "bmSubscriptionId",
                    "pullPaymentId",
                    "networkId",
                    "contractAddress"
                ),
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
                "contractAddress" character varying(42) NOT NULL,
                "networkId" character varying(42) NOT NULL,
                "subscriber" character varying(255) NOT NULL,
                "paymentToken" character varying(255) NOT NULL,
                "numberOfPayments" character varying(255),
                "startTimestamp" character varying(11),
                "cancelTimestamp" character varying(11),
                "nextPaymentTimestamp" character varying(11),
                "lastPaymentTimestamp" character varying(11),
                CONSTRAINT "UQ_f1d0e5646065bcc273687029c86" UNIQUE (
                    "billingModelId",
                    "bmSubscriptionId",
                    "networkId",
                    "contractAddress"
                ),
                CONSTRAINT "PK_ea2ddb46987311b1580f9670619" PRIMARY KEY ("id")
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
                "syncStatus" "public"."contract_event_syncstatus_enum" NOT NULL DEFAULT 'Unprocessed',
                "syncHistorical" boolean NOT NULL,
                "lastSyncedBlock" integer NOT NULL,
                "lastSyncedTxHash" character varying(66),
                "contractAddress" character varying(42) NOT NULL,
                "networkId" character varying NOT NULL,
                CONSTRAINT "PK_ae4dd77ab08b3ffce5adf5742ae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."contract" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" SERIAL NOT NULL,
                "contractName" character varying(255) NOT NULL,
                "address" character varying(42) NOT NULL,
                "networkId" character varying NOT NULL,
                "abi" character varying NOT NULL,
                CONSTRAINT "UQ_ab7bd258144580776f32a7d3c34" UNIQUE ("address", "networkId"),
                CONSTRAINT "PK_6206b6a65d200d15180a49d3c95" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."billing_model" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "billingModelId" character varying(255) NOT NULL,
                "contractAddress" character varying(42) NOT NULL,
                "networkId" character varying(42) NOT NULL,
                "payee" character varying(255) NOT NULL,
                "name" character varying(255) NOT NULL,
                "amount" character varying(255) NOT NULL,
                "sellingToken" character varying(255) NOT NULL,
                "settlementToken" character varying(255) NOT NULL,
                "frequency" character varying(255),
                "numberOfPayments" character varying(255),
                CONSTRAINT "UQ_b64d0a0ee3bb60bdd10092d8be1" UNIQUE ("billingModelId", "networkId", "contractAddress"),
                CONSTRAINT "PK_6e0f970ffe341139eede9006038" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."pull_payment"
            ADD CONSTRAINT "FK_7626e51274c007ede88e4713ee9" FOREIGN KEY (
                    "billingModelId",
                    "bmSubscriptionId",
                    "networkId",
                    "contractAddress"
                ) REFERENCES "public"."bm_subscription"(
                    "billingModelId",
                    "bmSubscriptionId",
                    "networkId",
                    "contractAddress"
                ) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription"
            ADD CONSTRAINT "FK_18723ee2adc379fab7221fd283c" FOREIGN KEY ("billingModelId", "networkId", "contractAddress") REFERENCES "public"."billing_model"("billingModelId", "networkId", "contractAddress") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."contract_event"
            ADD CONSTRAINT "FK_f09d17fd134670dfa6afdc1d9dc" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "public"."contract"("address", "networkId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."billing_model"
            ADD CONSTRAINT "FK_3a7c5e81b08a6eee0c6d17dd168" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "public"."contract"("address", "networkId") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."billing_model" DROP CONSTRAINT "FK_3a7c5e81b08a6eee0c6d17dd168"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."contract_event" DROP CONSTRAINT "FK_f09d17fd134670dfa6afdc1d9dc"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription" DROP CONSTRAINT "FK_18723ee2adc379fab7221fd283c"
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."pull_payment" DROP CONSTRAINT "FK_7626e51274c007ede88e4713ee9"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."billing_model"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."contract"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."contract_event"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."contract_event_syncstatus_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."bm_subscription"
        `);
        await queryRunner.query(`
            DROP TABLE "public"."pull_payment"
        `);
    }

}
