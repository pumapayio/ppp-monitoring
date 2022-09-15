import { Injectable, Logger } from '@nestjs/common'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { ContractEvent } from '../../../api/contract-event/contract-event.entity'
import { ContractEventLog } from '../../../utils/blockchain'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'

@Injectable()
export class SubscriptionCancelledEventMonitoring {
  private readonly logger = new Logger(
    SubscriptionCancelledEventMonitoring.name,
  )

  constructor(
    private baseMonitoring: BaseMonitoring,
    private utils: UtilsService,
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
        `Failed to handle bm subscription cancelled events. Reason: ${error.message}`,
      )
    }
  }

  private async handleEventLog(
    contract: any,
    merchantAddresses: string[],
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: RecurringPullPaymentEventHandler,
    utils: UtilsService,
  ): Promise<void> {
    try {
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

          await utils.notifyMerchant(
            ContractEventTypes.SubscriptionCancelled,
            bmSubscription,
          )
        }
      }
    } catch (error) {
      this.logger.debug(
        `Failed to handle bm subscription cancelled event logs. Reason: ${error.message}`,
      )
    }
  }
}
