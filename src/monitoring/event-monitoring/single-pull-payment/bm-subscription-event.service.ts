import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'

@Injectable()
export class SingleBMSubscriptionEventMonitoring {
  private readonly logger = new Logger(SingleBMSubscriptionEventMonitoring.name)

  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: SinglePullPaymentEventHandler,
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
        `Failed to handle pull payment execution events. Reason: ${error.message}`,
      )
    }
  }

  private async handleEventLog(
    contract: any,
    merchantAddresses: string[],
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: SinglePullPaymentEventHandler,
    utils: UtilsService,
  ): Promise<void> {
    try {
      if (merchantAddresses.length === 0) {
        await eventHandler.handleBMSubscriptionCreation(
          contract,
          event,
          eventLog,
        )
        await eventHandler.handlePPCreation(contract, event, eventLog)
      } else {
        if (merchantAddresses.includes(eventLog.returnValues.payee)) {
          const bmSubscription =
            await eventHandler.handleBMSubscriptionCreation(
              contract,
              event,
              eventLog,
            )

          const pullPayment = await eventHandler.handlePPCreation(
            contract,
            event,
            eventLog,
          )
          pullPayment.bmSubscription = bmSubscription

          if (utils.isMerchantNotification())
            // NOTE: The actual event here is a new subscription, but since we are
            // dealing with single payments it is also the execution of the pull
            // payment, and we notify the merchant with this type of event
            await utils.notifyMerchant(
              ContractEventTypes.PullPaymentExecuted,
              pullPayment,
            )
        }
      }
    } catch (error) {
      this.logger.debug(
        `Failed to handle pull payment execution event logs. Reason: ${error.message}`,
      )
    }
  }
}
