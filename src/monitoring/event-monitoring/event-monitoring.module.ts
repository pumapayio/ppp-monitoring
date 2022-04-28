import { Module } from '@nestjs/common'
import { SinglePullPaymentBMCreatedEventMonitoring } from './single-pull-payment/bm-created-event.service'
import { ContractEventModule } from 'src/api/contract-event/contract-event.module'
import { UtilsModule } from 'src/utils/utils.module'
import { BillingModelModule } from 'src/api/billiing-model/billing-model.module'
import { SingleBMSubscriptionEventMonitoring } from './single-pull-payment/bm-subscription-event.service'
import { BMSubscriptionModule } from 'src/api/bm-subscription/bm-subscription.module'
import { PullPaymentModule } from 'src/api/pull-payment/pull-payment.module'
import { SinglePullPaymentBMEditedEventMonitoring } from './single-pull-payment/bm-edited-event.service'
import { RecurringPullPaymentBMCreatedEventMonitoring } from './recurring-pull-payment/bm-created-event.service'
import { RecurringBMSubscriptionEventMonitoring } from './recurring-pull-payment/bm-subscription-event.service'
import { RecurringPPExecutionEventMonitoring } from './recurring-pull-payment/pp-executed-event.service'
import { RecurringPullPaymentBMEditedEventMonitoring } from './recurring-pull-payment/bm-edited-event.service'
import { SinglePullPaymentEventHandler } from './single-pull-payment/single-pull-payment.event-handler'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment/recurring-pull-payment.event-handler'
import { BaseMonitoring } from './base-monitoring/base-monitoring'
import { SubscriptionCancelledEventMonitoring } from './recurring-pull-payment/subscription-cancelled-event.service'

@Module({
  providers: [
    BaseMonitoring,
    // Single BM
    SinglePullPaymentBMCreatedEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
    SingleBMSubscriptionEventMonitoring,
    SinglePullPaymentEventHandler,
    // Recurring BM
    RecurringPullPaymentBMCreatedEventMonitoring,
    RecurringPullPaymentBMEditedEventMonitoring,
    RecurringBMSubscriptionEventMonitoring,
    RecurringPPExecutionEventMonitoring,
    RecurringPullPaymentEventHandler,
    SubscriptionCancelledEventMonitoring,
  ],
  exports: [
    BaseMonitoring,
    // Single BM
    SinglePullPaymentBMCreatedEventMonitoring,
    SinglePullPaymentBMEditedEventMonitoring,
    SingleBMSubscriptionEventMonitoring,
    SinglePullPaymentEventHandler,
    // Recurring BM
    RecurringPullPaymentBMCreatedEventMonitoring,
    RecurringPullPaymentBMEditedEventMonitoring,
    RecurringBMSubscriptionEventMonitoring,
    RecurringPPExecutionEventMonitoring,
    RecurringPullPaymentEventHandler,
    SubscriptionCancelledEventMonitoring,
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
