import { Module } from '@nestjs/common'
import { SinglePullPaymentBMCreatedEventMonitoring } from './single-pull-payment/bm-created-event.service'
import { RecurringPullPaymentService } from './recurring-pull-payment/recurring-pull-payment.service'
import { ContractEventModule } from 'src/api/contract-event/contract-event.module'
import { UtilsModule } from 'src/utils/utils.module'
import { BillingModelModule } from 'src/api/billiing-model/billing-model.module'
import { SinglePullPaymentPPExectutedEventMonitoring } from './single-pull-payment/pp-executed-event.service'
import { BMSubscriptionModule } from 'src/api/bm-subscription/bm-subscription.module'
import { PullPaymentModule } from 'src/api/pull-payment/pull-payment.module'
import { SinglePullPaymentBMEditedEventMonitoring } from './single-pull-payment/bm-edited-event.service'

@Module({
  providers: [
    SinglePullPaymentBMCreatedEventMonitoring,
    SinglePullPaymentPPExectutedEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
    RecurringPullPaymentService,
  ],
  exports: [
    SinglePullPaymentBMCreatedEventMonitoring,
    SinglePullPaymentPPExectutedEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
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
