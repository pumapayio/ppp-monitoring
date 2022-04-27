import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'

@Injectable()
export class RecurringPullPaymentBMCreatedEventMonitoring {
  private readonly logger = new Logger(
    RecurringPullPaymentBMCreatedEventMonitoring.name,
  )

  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: RecurringPullPaymentEventHandler,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    await this.baseMonitoring.monitor(
      event,
      this.eventHandler,
      this.handleEventLog,
    )
  }

  private async handleEventLog(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: RecurringPullPaymentEventHandler,
  ): Promise<void> {
    await eventHandler.handleBMCreateOrEditEvent(
      eventLog.returnValues.billingModelID,
      contract,
      event,
    )
  }
}
