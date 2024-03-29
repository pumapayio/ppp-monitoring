import { Module } from '@nestjs/common'
import { APIController } from './api.controller'
import { SharedModule } from './shared/shared.module'
import { BillingModelModule } from './billiing-model/billing-model.module'
import { BMSubscriptionModule } from './bm-subscription/bm-subscription.module'
import { PullPaymentModule } from './pull-payment/pull-payment.module'
import { ContractEventModule } from './contract-event/contract-event.module'
import { ContractModule } from './contract/contract.module'

@Module({
  imports: [
    SharedModule,
    BillingModelModule,
    BMSubscriptionModule,
    PullPaymentModule,
    ContractEventModule,
    ContractModule,
  ],
  exports: [
    BillingModelModule,
    BMSubscriptionModule,
    PullPaymentModule,
    ContractEventModule,
  ],
  controllers: [APIController],
})
export class ApiModule {}
