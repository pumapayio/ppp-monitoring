import { Injectable, Logger } from '@nestjs/common'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { ContractEvent } from '../../../api/contract-event/contract-event.entity'
import { ContractEventLog } from '../../../utils/blockchain'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'

@Injectable()
export class SubscriptionCancelledEventMonitoring {
  private readonly logger = new Logger(
    SubscriptionCancelledEventMonitoring.name,
  )

  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: RecurringPullPaymentEventHandler,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    try {
      await this.baseMonitoring.monitor(
        event,
        this.eventHandler,
        this.handleEventLog,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to handle billing model creation events. Reason: ${error.message}`,
      )
    }
  }

  private async handleEventLog(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: RecurringPullPaymentEventHandler,
  ): Promise<void> {
    await eventHandler.handleBMSubscriptionCreateOrEditEvent(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      contract,
      event,
    )
  }
}
