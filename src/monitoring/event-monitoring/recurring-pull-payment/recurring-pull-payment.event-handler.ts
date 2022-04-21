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
export class RecurringPullPaymentEventHandler {
  public constructor(
    private web3Helper: Web3Helper,
    private billingModelService: BillingModelService,
    private bmSubscriptionsService: BMSubscriptionService,
    private pullPaymentService: PullPaymentService,
  ) {}

  public async handleBMCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
  ) {
    const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
    const unserializedBillingModel: UnserializedBillingModel =
      await contract.methods
        .getBillingModel(eventLog.returnValues.billingModelID)
        .call()

    const billinModelDetails = serializeBMDetails(
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )

    const dbRecord = await this.billingModelService.retrieveByBlockchainId(
      eventLog.returnValues.billingModelID,
      event.contractAddress,
      event.networkId,
    )
    if (dbRecord) billinModelDetails.id = dbRecord.id

    await this.billingModelService.create(billinModelDetails)
  }

  public async handleBMEditEvent(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
  ) {
    /* 
    ==================================================================
    TODO: This approach is better as we don't make another call to retreive the bm details
    from the blokchain - need to figure out why we are getting `Invalid UTF-8 detected` and
    `Invalid continuation byte` errors though with this approach
    ==================================================================
    const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
    const eventData: BillingModelEditedEvent = eventLog.returnValues
    console.log(eventData)
    const updateBM: UpdateBMDto = {
      billingModelId: eventData.billingModelID,
      name: web3Utils.hexToUtf8(eventData.newName),
      amount: eventData.amount,
      sellingToken: eventData.settlementToken,
      settlementToken: eventData.settlementToken,
      payee: eventData.newPayee,
    }
    */
    const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
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

    await this.billingModelService.update(updateBM)
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

    const dbRecord = await this.bmSubscriptionsService.retrieveByBlockchainId(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      event.contractAddress,
      event.networkId,
    )
    if (dbRecord) serializedSubscription.id = dbRecord.id

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

    const dbRecord = await this.pullPaymentService.retrieveByBlockchainId(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      eventLog.returnValues.pullPaymentID,
      event.contractAddress,
      event.networkId,
    )
    if (dbRecord) serializedPullPayment.id = dbRecord.id

    await this.pullPaymentService.create(serializedPullPayment)
  }

  public async updateBMForPullPaymentExecution(
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
    await this.bmSubscriptionsService.update(
      serializedSubscription,
      event.networkId,
      event.contractAddress,
    )
  }
}
