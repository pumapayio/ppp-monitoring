import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1649585016881 implements MigrationInterface {
    name = 'initial1649585016881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "public"."billing_model" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "billingModelID" character varying(255) NOT NULL,
                "payee" character varying(255) NOT NULL,
                "name" character varying(255) NOT NULL,
                "amount" character varying(255) NOT NULL,
                "token" character varying(255) NOT NULL,
                "frequency" character varying(255) NOT NULL,
                "numberOfPayments" character varying(255) NOT NULL,
                CONSTRAINT "PK_c7ad5c91dd64cd79f2c55e2addf" PRIMARY KEY ("billingModelID")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "public"."bm_subscription" (
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                "subscriptionID" character varying(255) NOT NULL,
                "billingModelID" character varying(255) NOT NULL,
                "subscriber" character varying(255) NOT NULL,
                "paymentToken" character varying(255) NOT NULL,
                "numberOfPayments" character varying(255) NOT NULL,
                "startTimestamp" character varying(255) NOT NULL,
                "cancelTimestamp" character varying(255) NOT NULL,
                "nextPaymentTimestamp" character varying(255) NOT NULL,
                "lastPaymentTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "PK_ecd19fbc77493cf42b1adaf8069" PRIMARY KEY ("subscriptionID")
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
                "pullPaymentID" character varying(255) NOT NULL,
                "subscriptionID" character varying(255) NOT NULL,
                "paymentAmount" character varying(255) NOT NULL,
                "executionTimestamp" character varying(255) NOT NULL,
                CONSTRAINT "PK_43358bc1a1af769666954747ab0" PRIMARY KEY ("pullPaymentID")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription"
            ADD CONSTRAINT "FK_5f4423dd47f9c56de666e9df55c" FOREIGN KEY ("billingModelID") REFERENCES "public"."billing_model"("billingModelID") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "public"."bm_subscription" DROP CONSTRAINT "FK_5f4423dd47f9c56de666e9df55c"
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
