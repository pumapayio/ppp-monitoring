import { Injectable } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'

@Injectable()
export class SinglePullPaymentBMCreatedEventMonitoring {
  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: SinglePullPaymentEventHandler,
  ) {}

  public async monitor(
    event: ContractEvent,
    merchantAddresses: string[],
  ): Promise<void> {
    await this.baseMonitoring.monitor(
      event,
      merchantAddresses,
      this.eventHandler,
      this.handleEventLog,
    )
  }

  private async handleEventLog(
    contract: any,
    merchantAddresses: string[],
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: SinglePullPaymentEventHandler,
  ): Promise<void> {
    if (merchantAddresses.length === 0) {
      // for non-merchant mode, we store all the events
      await eventHandler.handleBMCreateOrEditEvent(
        eventLog.returnValues.billingModelID,
        contract,
        event,
      )
    } else {
      // in case of merchant mode, we need to check if the payee
      // is also part of the list of merchant addresses
      if (merchantAddresses.includes(eventLog.returnValues.payee)) {
        const bm = await eventHandler.handleBMCreateOrEditEvent(
          eventLog.returnValues.billingModelID,
          contract,
          event,
        )

        delete bm.createdAt
        delete bm.updatedAt
        console.log('bm', bm)
        // TODO: In case of 'Merchant' Mode
        // We call an API which we can have the API key and url as
        // configuration parameter for the developer to specify
      }
    }
  }
}
