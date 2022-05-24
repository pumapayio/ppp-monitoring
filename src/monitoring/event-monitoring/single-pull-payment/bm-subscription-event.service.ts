import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'

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
        `Failed to handle billing model creation events. Reason: ${error.message}`,
      )
    }
  }

  private async handleEventLog(
    contract: any,
    merchantAddresses: string[],
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: SinglePullPaymentEventHandler,
  ): Promise<void> {
    if (merchantAddresses.length === 0) {
      await eventHandler.handleBMSubscriptionCreation(contract, event, eventLog)
      await eventHandler.handlePPCreation(contract, event, eventLog)
    } else {
      if (merchantAddresses.includes(eventLog.returnValues.payee)) {
        const bmSubscription = await eventHandler.handleBMSubscriptionCreation(
          contract,
          event,
          eventLog,
        )

        console.log('bmSubscription', bmSubscription)
        const pullPayment = await eventHandler.handlePPCreation(
          contract,
          event,
          eventLog,
        )
        console.log('pullPayment', pullPayment)
        // TODO: In case of 'Merchant' Mode
        // We call an API which we can have the API key and url as
        // configuration parameter for the developer to specify
      }
    }
  }
}
