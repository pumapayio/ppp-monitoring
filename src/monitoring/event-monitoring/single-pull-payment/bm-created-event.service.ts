import { Injectable, Logger } from '@nestjs/common'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventLog } from 'src/utils/blockchain'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'

@Injectable()
export class SinglePullPaymentBMCreatedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMCreatedEventMonitoring.name,
  )

  constructor(
    private baseMonitoring: BaseMonitoring,
    private eventHandler: SinglePullPaymentEventHandler,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    await this.baseMonitoring.monitor(
      event,
      this.eventHandler,
      this.handleEventLog,
    )
  }

  private async handleEventLog(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: SinglePullPaymentEventHandler,
  ): Promise<void> {
    await eventHandler.handleBMCreateOrEditEvent(
      eventLog.returnValues.billingModelID,
      contract,
      event,
    )
    // TODO: In case of 'Merchant' Mode
    // We call an API which we can have the API key and url as
    // configuration parameter for the developer to specify
  }
}
