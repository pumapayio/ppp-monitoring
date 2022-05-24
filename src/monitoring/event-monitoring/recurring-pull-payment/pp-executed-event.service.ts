import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { RecurringPullPaymentEventHandler } from './recurring-pull-payment.event-handler'

@Injectable()
export class RecurringPPExecutionEventMonitoring {
  private readonly logger = new Logger(RecurringPPExecutionEventMonitoring.name)

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
      await eventHandler.handlePPCreation(contract, event, eventLog)
    } else {
      if (merchantAddresses.includes(eventLog.returnValues.payee)) {
        const pullPayment = await eventHandler.handlePPCreation(
          contract,
          event,
          eventLog,
        )

        delete pullPayment.createdAt
        delete pullPayment.updatedAt
        console.log('pullPayment', pullPayment)
      }
    }
  }
}
