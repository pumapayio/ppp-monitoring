import { Module } from '@nestjs/common'
import { APIController } from './api.controller'
import { SharedModule } from './shared/shared.module'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from './guard/roles.guard'
import { BillingModelModule } from './billiing-model/billing-model.module'
import { BMSubscriptionModule } from './bm-subscription/bm-subscription.module'
import { PullPaymentModule } from './pull-payment/pull-payment.module'
import { ContractEventModule } from './contract-event/contract-event.module'

@Module({
  imports: [
    SharedModule,
    BillingModelModule,
    BMSubscriptionModule,
    PullPaymentModule,
    ContractEventModule,
  ],
  exports: [
    BillingModelModule,
    BMSubscriptionModule,
    PullPaymentModule,
    ContractEventModule,
  ],
  controllers: [APIController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class ApiModule {}
