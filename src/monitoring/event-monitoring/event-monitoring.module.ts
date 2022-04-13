import { Module } from '@nestjs/common'
import { SinglePullPaymentBMCreatedEventMonitoring } from './single-pull-payment/bm-created-event.service'
import { RecurringPullPaymentService } from './recurring-pull-payment/recurring-pull-payment.service'
import { ContractEventModule } from 'src/api/contract-event/contract-event.module'
import { UtilsModule } from 'src/utils/utils.module'
import { BillingModelModule } from 'src/api/billiing-model/billing-model.module'
import { SingleBMSubscriptionEventMonitoring } from './single-pull-payment/bm-subscription-event.service'
import { BMSubscriptionModule } from 'src/api/bm-subscription/bm-subscription.module'
import { PullPaymentModule } from 'src/api/pull-payment/pull-payment.module'
import { SinglePullPaymentBMEditedEventMonitoring } from './single-pull-payment/bm-edited-event.service'
import { SinglePPExectutionEventMonitoring } from './single-pull-payment/pp-executed-event.service'

@Module({
  providers: [
    SinglePullPaymentBMCreatedEventMonitoring,
    SingleBMSubscriptionEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
    SinglePPExectutionEventMonitoring,
    RecurringPullPaymentService,
  ],
  exports: [
    SinglePullPaymentBMCreatedEventMonitoring,
    SingleBMSubscriptionEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
    SinglePPExectutionEventMonitoring,
    RecurringPullPaymentService,
  ],
  imports: [
    ContractEventModule,
    UtilsModule,
    BillingModelModule,
    BMSubscriptionModule,
    PullPaymentModule,
  ],
})
export class EventMonitoringModule {}
