import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'
import { ContractEventTypes } from '../../../api/contract-event/contract-event-types'

@Injectable()
export class RecurringPPExecutionEventMonitoring {
  private readonly logger = new Logger(RecurringPPExecutionEventMonitoring.name)

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
        `Failed to handle pull payment execution events. Reason: ${error.message}`,
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
    if (merchantAddresses.length === 0) {
      if (eventLog.returnValues.pullPaymentID != '0') {
        await eventHandler.handlePPCreation(contract, event, eventLog)
      }
    } else {
      if (merchantAddresses.includes(eventLog.returnValues.payee)) {
        if (eventLog.returnValues.pullPaymentID != '0') {
          const pullPayment = await eventHandler.handlePPCreation(
            contract,
            event,
            eventLog,
          )

          if (utils.isMerchantNotification())
            await utils.notifyMerchant(
              ContractEventTypes.PullPaymentExecuted,
              pullPayment,
            )
        }
      }
    }
  }
}
