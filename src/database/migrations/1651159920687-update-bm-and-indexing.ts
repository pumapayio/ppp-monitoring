import { MigrationInterface, QueryRunner } from 'typeorm'

export class updateBmAndIndexing1651159920687 implements MigrationInterface {
  name = 'updateBmAndIndexing1651159920687'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pull_payment" DROP CONSTRAINT "FK_7626e51274c007ede88e4713ee9"`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" DROP CONSTRAINT "FK_18723ee2adc379fab7221fd283c"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP CONSTRAINT "FK_3a7c5e81b08a6eee0c6d17dd168"`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract_event" DROP CONSTRAINT "FK_f09d17fd134670dfa6afdc1d9dc"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ef145addd8487cb2d5d8c12c5d"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecfe86d1e0eb32e864b311fc25"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_84aead5472ccc4d07d5feef37b"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9e879bbcb6ccb39de80cee11d9"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_08639f9a0949046b830eb9bb9f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca8fa48f33d9f4a6413c8b78d5"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3972833ba03ebd2165cee8c307"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31eecd5115d3237d08ad9ff80e"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d576b3f839d40fbd7b31c69370"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f015450739bda6fbf34a1dcddf"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2e6e39d90689d350eb98f5c622"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53e495b7fbc1577555a49ab527"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3f89860724cd1df4bb582fc73e"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e219808ce5e3e8451af9c6b0f3"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0a395eab38dfd222fdc23f4444"`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" DROP CONSTRAINT "UQ_006860fd9a0bb612df1bcee4dac"`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" DROP CONSTRAINT "UQ_f1d0e5646065bcc273687029c86"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP CONSTRAINT "UQ_b64d0a0ee3bb60bdd10092d8be1"`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "UQ_ab7bd258144580776f32a7d3c34"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD "trialPeriod" character varying(255)`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD "initialAmount" character varying(255)`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_abaa4d75159bf0ccad9bb5f641" ON "pull_payment" ("billingModelId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_399c64c8915a7c3117c4794868" ON "pull_payment" ("bmSubscriptionId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8310c32cd69385df8474be6691" ON "pull_payment" ("pullPaymentId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dc49472a42773c8ae7d0bf5c19" ON "pull_payment" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_64dcf9a8a240b6bc67c54fbbf9" ON "pull_payment" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_01f4b82ca0e030705aaeedb709" ON "bm_subscription" ("bmSubscriptionId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_82e2dc7a2c306693207fc5e079" ON "bm_subscription" ("billingModelId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_fea960ab379f9199cbf5d4b675" ON "bm_subscription" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_6577eebfb6b2eea2bf6f62f573" ON "bm_subscription" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d32ad9885659f5933c7db2e82c" ON "bm_subscription" ("nextPaymentTimestamp") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_43aea6212926b1fc814fc7b0c5" ON "billing_model" ("billingModelId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_dfe489d9243df9f2a14f69cc2a" ON "billing_model" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2a60663a7a8260c4c5f2f2eba1" ON "billing_model" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_b8ee4adea6e3668809e6757dc9" ON "contract" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_86c5d792e4f4f1c57e892fe48c" ON "contract_event" ("networkId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" ADD CONSTRAINT "UQ_e1e9f3ebf259026329fa9f2137f" UNIQUE ("billingModelId", "bmSubscriptionId", "pullPaymentId", "networkId", "contractAddress")`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD CONSTRAINT "UQ_07e9c9544cfe1f5a7b4179760e3" UNIQUE ("billingModelId", "bmSubscriptionId", "networkId", "contractAddress")`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD CONSTRAINT "UQ_eb293a32dcd1989b2de97a643bc" UNIQUE ("billingModelId", "networkId", "contractAddress")`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "UQ_5f9d58cff1cd6f880528dfb6eb2" UNIQUE ("address", "networkId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" ADD CONSTRAINT "FK_29d5ee7efcf8541976d5315dd40" FOREIGN KEY ("billingModelId", "bmSubscriptionId", "networkId", "contractAddress") REFERENCES "bm_subscription"("billingModelId","bmSubscriptionId","networkId","contractAddress") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD CONSTRAINT "FK_19a791472a613ac5b4f59a41c9f" FOREIGN KEY ("billingModelId", "networkId", "contractAddress") REFERENCES "billing_model"("billingModelId","networkId","contractAddress") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD CONSTRAINT "FK_3f086b8055412a66e2884a7c0a5" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "contract"("address","networkId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract_event" ADD CONSTRAINT "FK_c0bcb7afbef8e5a4dd7ab43f62f" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "contract"("address","networkId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_event" DROP CONSTRAINT "FK_c0bcb7afbef8e5a4dd7ab43f62f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP CONSTRAINT "FK_3f086b8055412a66e2884a7c0a5"`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" DROP CONSTRAINT "FK_19a791472a613ac5b4f59a41c9f"`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" DROP CONSTRAINT "FK_29d5ee7efcf8541976d5315dd40"`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "UQ_5f9d58cff1cd6f880528dfb6eb2"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP CONSTRAINT "UQ_eb293a32dcd1989b2de97a643bc"`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" DROP CONSTRAINT "UQ_07e9c9544cfe1f5a7b4179760e3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" DROP CONSTRAINT "UQ_e1e9f3ebf259026329fa9f2137f"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_86c5d792e4f4f1c57e892fe48c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b8ee4adea6e3668809e6757dc9"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2a60663a7a8260c4c5f2f2eba1"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfe489d9243df9f2a14f69cc2a"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_43aea6212926b1fc814fc7b0c5"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d32ad9885659f5933c7db2e82c"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6577eebfb6b2eea2bf6f62f573"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fea960ab379f9199cbf5d4b675"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82e2dc7a2c306693207fc5e079"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_01f4b82ca0e030705aaeedb709"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_64dcf9a8a240b6bc67c54fbbf9"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dc49472a42773c8ae7d0bf5c19"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8310c32cd69385df8474be6691"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_399c64c8915a7c3117c4794868"`,
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_abaa4d75159bf0ccad9bb5f641"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP COLUMN "initialAmount"`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" DROP COLUMN "trialPeriod"`,
    )
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "UQ_ab7bd258144580776f32a7d3c34" UNIQUE ("address", "networkId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD CONSTRAINT "UQ_b64d0a0ee3bb60bdd10092d8be1" UNIQUE ("billingModelId", "contractAddress", "networkId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD CONSTRAINT "UQ_f1d0e5646065bcc273687029c86" UNIQUE ("bmSubscriptionId", "billingModelId", "contractAddress", "networkId")`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" ADD CONSTRAINT "UQ_006860fd9a0bb612df1bcee4dac" UNIQUE ("billingModelId", "bmSubscriptionId", "pullPaymentId", "contractAddress", "networkId")`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_0a395eab38dfd222fdc23f4444" ON "contract_event" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e219808ce5e3e8451af9c6b0f3" ON "contract" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3f89860724cd1df4bb582fc73e" ON "billing_model" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_53e495b7fbc1577555a49ab527" ON "billing_model" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2e6e39d90689d350eb98f5c622" ON "billing_model" ("billingModelId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_f015450739bda6fbf34a1dcddf" ON "bm_subscription" ("nextPaymentTimestamp") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_d576b3f839d40fbd7b31c69370" ON "bm_subscription" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_31eecd5115d3237d08ad9ff80e" ON "bm_subscription" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_3972833ba03ebd2165cee8c307" ON "bm_subscription" ("billingModelId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ca8fa48f33d9f4a6413c8b78d5" ON "bm_subscription" ("bmSubscriptionId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_08639f9a0949046b830eb9bb9f" ON "pull_payment" ("networkId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_9e879bbcb6ccb39de80cee11d9" ON "pull_payment" ("contractAddress") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_84aead5472ccc4d07d5feef37b" ON "pull_payment" ("pullPaymentId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ecfe86d1e0eb32e864b311fc25" ON "pull_payment" ("bmSubscriptionId") `,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ef145addd8487cb2d5d8c12c5d" ON "pull_payment" ("billingModelId") `,
    )
    await queryRunner.query(
      `ALTER TABLE "contract_event" ADD CONSTRAINT "FK_f09d17fd134670dfa6afdc1d9dc" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "contract"("address","networkId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "billing_model" ADD CONSTRAINT "FK_3a7c5e81b08a6eee0c6d17dd168" FOREIGN KEY ("contractAddress", "networkId") REFERENCES "contract"("address","networkId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "bm_subscription" ADD CONSTRAINT "FK_18723ee2adc379fab7221fd283c" FOREIGN KEY ("billingModelId", "networkId", "contractAddress") REFERENCES "billing_model"("billingModelId","networkId","contractAddress") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "pull_payment" ADD CONSTRAINT "FK_7626e51274c007ede88e4713ee9" FOREIGN KEY ("billingModelId", "bmSubscriptionId", "networkId", "contractAddress") REFERENCES "bm_subscription"("billingModelId","bmSubscriptionId","networkId","contractAddress") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
