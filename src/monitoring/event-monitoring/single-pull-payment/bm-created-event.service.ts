import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import {
  serializeBMDetails,
  UnserializedBillingModel,
} from 'src/api/billiing-model/billing-model.serializer'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { ContractEventLog } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { BaseMonitoring } from '../base-monitoring/base-monitoring'

@Injectable()
export class SinglePullPaymentBMCreatedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMCreatedEventMonitoring.name,
  )

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private billingModelService: BillingModelService,
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
        this.billingModelService,
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
    entityService: BillingModelService,
    web3Helper: Web3Helper,
  ): Promise<void> {
    const web3Utils = web3Helper.getWeb3Utils(event.networkId)
    const unserializedBillingModel: UnserializedBillingModel = await contract.methods
      .getBillingModel(eventLog.returnValues.billingModelID)
      .call()
    const billinModelDetails = serializeBMDetails(
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )
    billinModelDetails.billingModelId = eventLog.returnValues.billingModelID

    await entityService.create(billinModelDetails)
  }
}
