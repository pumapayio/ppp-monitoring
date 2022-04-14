import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import {
  serializePullPayment,
  UnserializedPullPayment,
} from 'src/api/pull-payment/pull-payment.serializer'
import { PullPaymentService } from 'src/api/pull-payment/pull-payment.service'
import { ContractEventLog } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'

@Injectable()
export class RecurringPPExectutionEventMonitoring {
  private readonly logger = new Logger(
    RecurringPPExectutionEventMonitoring.name,
  )

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private pullPaymentService: PullPaymentService,
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
        this.pullPaymentService,
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
    entityService: PullPaymentService,
    web3Helper: Web3Helper,
  ): Promise<void> {
    const unserializedPullPayment: UnserializedPullPayment =
      await contract.methods
        .getPullPayment(eventLog.returnValues.pullPaymentID)
        .call()

    const pullPaymentDetails = serializePullPayment(
      eventLog.returnValues.pullPaymentID,
      eventLog.returnValues.subscriptionID,
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedPullPayment,
    )

    await entityService.create(pullPaymentDetails)
  }
}
