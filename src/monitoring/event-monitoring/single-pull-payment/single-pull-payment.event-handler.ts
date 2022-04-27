import { Injectable } from '@nestjs/common'
import {
  UnserializedBillingModel,
  serializeBMDetails,
} from 'src/api/billiing-model/billing-model.serializer'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import {
  UnserializedBMSubscription,
  serializeBMSubscription,
} from 'src/api/bm-subscription/bm-subscription.serializer'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import {
  UnserializedPullPayment,
  serializePullPayment,
} from 'src/api/pull-payment/pull-payment.serializer'
import { PullPaymentService } from 'src/api/pull-payment/pull-payment.service'
import { ContractEventLog } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePullPaymentEventHandler {
  public constructor(
    private web3Helper: Web3Helper,
    private billingModelService: BillingModelService,
    private bmSubscriptionsService: BMSubscriptionService,
    private pullPaymentService: PullPaymentService,
  ) {}

  public async handleBMCreateOrEditEvent(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
    checkDb = true,
  ) {
    const billingModelDetails = await this.constructBMDetails(
      billingModelId,
      contract,
      event,
      checkDb,
    )
    await this.billingModelService.create(billingModelDetails)
  }

  public async handleBMSubscriptionCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
  ) {
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

    await this.handleMissingBMRecord(
      eventLog.returnValues.billingModelID,
      contract,
      event,
    )
    await this.bmSubscriptionsService.create(serializedSubscription)
  }

  public async handlePPCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
  ) {
    const unserializedPullPayment: UnserializedPullPayment =
      await contract.methods
        .getPullPayment(eventLog.returnValues.pullPaymentID)
        .call()
    const serializedPullPayment = serializePullPayment(
      eventLog.returnValues.pullPaymentID,
      eventLog.returnValues.subscriptionID,
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedPullPayment,
    )

    await this.pullPaymentService.create(serializedPullPayment)
  }

  private async constructBMDetails(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
    const unserializedBillingModel: UnserializedBillingModel =
      await contract.methods.getBillingModel(billingModelId).call()
    const billinModelDetails = serializeBMDetails(
      billingModelId,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )
    billinModelDetails.billingModelId = billingModelId

    if (checkDb) {
      const dbRecord = await this.billingModelService.retrieveByBlockchainId(
        billingModelId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) billinModelDetails.id = dbRecord.id
    }

    return billinModelDetails
  }

  private async handleMissingBMRecord(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
  ) {
    const dbRecord = await this.billingModelService.retrieveByBlockchainId(
      billingModelId,
      event.contractAddress,
      event.networkId,
    )
    if (dbRecord) return
    // no need to check from the db as we just did above
    // and we know that the record doesn't exist
    await this.handleBMCreateOrEditEvent(billingModelId, contract, event, false)
  }
}
