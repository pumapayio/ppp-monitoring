import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  serializeBMSubscription,
  UnserializedBMSubscription,
} from 'src/api/bm-subscription/bm-subscription.serializer'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { PullPaymentService } from 'src/api/pull-payment/pull-payment.service'
import { ContractEventLog } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'

@Injectable()
export class RecurringBMSubscriptionEventMonitoring {
  private readonly logger = new Logger(
    RecurringBMSubscriptionEventMonitoring.name,
  )

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private bmSubscriptionsService: BMSubscriptionService,
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
        this.bmSubscriptionsService,
        this.handleEventLog,
        this.pullPaymentService,
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
    entityService: BMSubscriptionService,
    web3Helper: Web3Helper,
    secondEntityService: PullPaymentService,
  ): Promise<void> {
    const unserializedSubscription: UnserializedBMSubscription =
      await contract.methods
        .getSubscription(eventLog.returnValues.subscriptionID)
        .call()
    const serializedSubscription = serializeBMSubscription(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      event.contractAddress,
      event.networkId,
      unserializedSubscription,
    )

    await entityService.create(serializedSubscription)
  }
}
