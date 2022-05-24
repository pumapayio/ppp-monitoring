import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'

@Injectable()
export class RecurringBMSubscriptionEventMonitoring {
  private readonly logger = new Logger(
    RecurringBMSubscriptionEventMonitoring.name,
  )

  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: RecurringPullPaymentEventHandler,
  ) {}

  public async monitor(
    event: ContractEvent,
    merchantAddresses: string[],
  ): Promise<void> {
    try {
      await this.baseMonitoring.monitor(
        event,
        merchantAddresses,
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
    merchantAddresses: string[],
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: RecurringPullPaymentEventHandler,
  ): Promise<void> {
    if (merchantAddresses.length === 0) {
      await eventHandler.handleBMSubscriptionCreateOrEditEvent(
        eventLog.returnValues.billingModelID,
        eventLog.returnValues.subscriptionID,
        contract,
        event,
      )
    } else {
      if (merchantAddresses.includes(eventLog.returnValues.payee)) {
        const bmSubscription =
          await eventHandler.handleBMSubscriptionCreateOrEditEvent(
            eventLog.returnValues.billingModelID,
            eventLog.returnValues.subscriptionID,
            contract,
            event,
          )

        delete bmSubscription.createdAt
        delete bmSubscription.updatedAt
        console.log('bmSubscription', bmSubscription)
      }
    }
  }
}
