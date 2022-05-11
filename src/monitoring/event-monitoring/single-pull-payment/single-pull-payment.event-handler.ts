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
import { TransactionReceipt } from 'web3-core'

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

  private async constructBMDetails(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
    const unserializedBillingModel: UnserializedBillingModel =
      await contract.methods.getBillingModel(billingModelId).call()
    const billingModelDetails = serializeBMDetails(
      billingModelId,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )
    billingModelDetails.billingModelId = billingModelId

    if (checkDb) {
      const dbRecord = await this.billingModelService.retrieveByBlockchainId(
        billingModelId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) billingModelDetails.id = dbRecord.id
    }

    return billingModelDetails
  }

  public async handleBMSubscriptionCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb = true,
  ) {
    const serializedSubscription = await this.constructBMSubscriptionDetails(
      contract,
      event,
      eventLog,
      checkDb,
    )
    await this.handleMissingBMRecord(
      eventLog.returnValues.billingModelID,
      contract,
      event,
    )
    await this.bmSubscriptionsService.create(serializedSubscription)
  }

  private async constructBMSubscriptionDetails(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb,
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

    if (checkDb) {
      const dbRecord = await this.bmSubscriptionsService.retrieveByBlockchainId(
        eventLog.returnValues.billingModelID,
        eventLog.returnValues.subscriptionID,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) serializedSubscription.id = dbRecord.id
    }

    return serializedSubscription
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

  public async handlePPCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb = true,
  ) {
    const serializedPullPayment = await this.constructPPDetails(
      contract,
      event,
      eventLog,
      checkDb,
    )
    await this.pullPaymentService.create(serializedPullPayment)
  }

  private async constructPPDetails(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb: boolean,
  ) {
    const unserializedPullPayment: UnserializedPullPayment =
      await contract.methods
        .getPullPayment(eventLog.returnValues.pullPaymentID)
        .call()

    const serializedPullPayment = await serializePullPayment(
      eventLog.returnValues.pullPaymentID,
      eventLog.returnValues.subscriptionID,
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedPullPayment,
      eventLog.transactionHash,
      this.web3Helper.getWeb3Instance(contract.networkId),
    )

    if (checkDb) {
      const dbRecord = await this.pullPaymentService.retrieveByBlockchainId(
        eventLog.returnValues.billingModelID,
        eventLog.returnValues.subscriptionID,
        eventLog.returnValues.pullPaymentID,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) serializedPullPayment.id = dbRecord.id
    }

    return serializedPullPayment
  }
}
