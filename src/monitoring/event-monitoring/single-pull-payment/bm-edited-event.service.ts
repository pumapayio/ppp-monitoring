import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'
import { BillingModel } from '../../../api/billiing-model/billing-model.entity'

@Injectable()
export class SinglePullPaymentBMEditedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMEditedEventMonitoring.name,
  )

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
    utils: UtilsService,
  ) {
    console.log(eventLog)
    if (merchantAddresses.length === 0) {
      await eventHandler.handleBMCreateOrEditEvent(
        eventLog.returnValues.billingModelID,
        contract,
        event,
      )
    } else {
      if (
        merchantAddresses.includes(eventLog.returnValues.oldPayee) ||
        merchantAddresses.includes(eventLog.returnValues.newPayee)
      ) {
        const bm = await eventHandler.handleBMCreateOrEditEvent(
          eventLog.returnValues.billingModelID,
          contract,
          event,
        )

        await utils.notifyMerchant(ContractEventTypes.BillingModelEdited, bm)
      }
    }
  }
}
