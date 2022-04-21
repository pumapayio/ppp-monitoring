import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { ContractEventLog } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'
import { SinglePullPaymentEventHandler } from './single-pull-payment.event-handler'

@Injectable()
export class SingleBMSubscriptionEventMonitoring {
  private readonly logger = new Logger(SingleBMSubscriptionEventMonitoring.name)

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private eventHandler: SinglePullPaymentEventHandler,
    private contractEventService: ContractEventService,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    try {
      const baseMonitoring = new BaseMonitoring(
        this.config,
        this.web3Helper,
        this.contractEventService,
      )
      await baseMonitoring.monitor(
        event,
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
    event: ContractEvent,
    eventLog: ContractEventLog,
    eventHandler: SinglePullPaymentEventHandler,
  ): Promise<void> {
    await eventHandler.handleBMSubscriptionCreation(contract, event, eventLog)
    await eventHandler.handlePPCreation(contract, event, eventLog)
  }
}
