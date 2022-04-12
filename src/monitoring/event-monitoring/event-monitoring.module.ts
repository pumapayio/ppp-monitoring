import { Module } from '@nestjs/common'
import { SinglePullPaymentEventMonitoring } from './single-pull-payment/single-pull-payment.service'
import { RecurringPullPaymentService } from './recurring-pull-payment/recurring-pull-payment.service'
import { ContractEventModule } from 'src/api/contract-event/contract-event.module'
import { UtilsModule } from 'src/utils/utils.module'
import { BillingModelModule } from 'src/api/billiing-model/billing-model.module'

@Module({
  providers: [SinglePullPaymentEventMonitoring, RecurringPullPaymentService],
  exports: [SinglePullPaymentEventMonitoring, RecurringPullPaymentService],
  imports: [ContractEventModule, UtilsModule, BillingModelModule],
})
export class EventMonitoringModule {}
