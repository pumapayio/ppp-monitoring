import { Injectable } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'

@Injectable()
export class RecurringPullPaymentBMCreatedEventMonitoring {
  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: RecurringPullPaymentEventHandler,
  ) {}

  public async monitor(
    event: ContractEvent,
    merchantAddresses: string[],
  ): Promise<void> {
    // We don't handle (try-catch) this one so that we allow the
    // app to crash in case there is no EXECUTOR_PRIVATE_KEY configured
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
    eventHandler: RecurringPullPaymentEventHandler,
    utils: UtilsService,
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

        await utils.notifyMerchant(ContractEventTypes.BillingModelCreated, bm)
      }
    }
  }
}
