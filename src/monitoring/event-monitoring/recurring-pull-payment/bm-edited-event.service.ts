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
export class RecurringPullPaymentBMEditedEventMonitoring {
  private readonly logger = new Logger(
    RecurringPullPaymentBMEditedEventMonitoring.name,
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
  ) {
    // ==================================================================
    // TODO: This approach is better as we don't make another call to retreive the bm details
    // from the blokchain - need to figure out why we are getting `Invalid UTF-8 detected` and
    // `Invalid continuation byte` errors though with this approach
    // ==================================================================
    // const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
    // const eventData: BillingModelEditedEvent = eventLog.returnValues
    // console.log(eventData)
    // const updateBM: UpdateBMDto = {
    //   billingModelId: eventData.billingModelID,
    //   name: web3Utils.hexToUtf8(eventData.newName),
    //   amount: eventData.amount,
    //   sellingToken: eventData.settlementToken,
    //   settlementToken: eventData.settlementToken,
    //   payee: eventData.newPayee,
    // }
    const web3Utils = web3Helper.getWeb3Utils(event.networkId)
    const unserializedBillingModel: UnserializedBillingModel =
      await contract.methods
        .getBillingModel(eventLog.returnValues.billingModelID)
        .call()
    const updateBM = serializeBMDetails(
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )

    await entityService.update(updateBM)
  }
}
