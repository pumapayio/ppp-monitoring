import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'

@Injectable()
export class SinglePullPaymentBMCreatedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMCreatedEventMonitoring.name,
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
  ): Promise<void> {
    try {
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

          if (utils.isMerchantNotification())
            await utils.notifyMerchant(
              ContractEventTypes.BillingModelCreated,
              bm,
            )
        }
      }
    } catch (error) {
      this.logger.debug(
        `Failed to handle billing model creation event log. Reason: ${error.message}`,
      )
    }
  }
}
