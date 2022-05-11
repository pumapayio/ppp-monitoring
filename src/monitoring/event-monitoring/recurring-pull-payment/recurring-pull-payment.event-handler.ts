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
import { ContractEventLog, SmartContractNames } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { TransactionReceipt } from 'web3-core'

@Injectable()
export class RecurringPullPaymentEventHandler {
  public constructor(
    private web3Helper: Web3Helper,
    private billingModelService: BillingModelService,
    private bmSubscriptionsService: BMSubscriptionService,
    private pullPaymentService: PullPaymentService,
  ) {}

  // Method used to handle create or edit Billing Model (BM) events
  // We first construct the bm details
  // When constructing the BM details, we take the following actions:
  // 1. Retrieve the billing model details from the blockchain
  // 2. Serialize them
  // 3. Check in our DB if the record exists or not
  // 4. Based on the above, attach to the returned object the ID from our db
  //    By doing so, we allow typeORM to either create or update
  // The above process is followed on all CREATION events:
  // - Billing Model
  // - BM Subscription
  // - Pull Payment
  // In addition to the above, when it comes to BM Subscription, we also
  // check if the parent BM exist in our DB - if it does, then all good,
  // otherwise, we retrieve the data from the blockchain and we store it
  // in our DB.
  // We follow the above for the pull payments as well, i.e. if the
  // parent BM subscription doesn't exists in our DB, we retrieve it
  // and store it.
  // The above makes sure that even if a 'parent' event was missed during
  // monitoring, we will retrieve it when we get the 'child' event
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

  public async handleBMSubscriptionCreateOrEditEvent(
    billingModelId: string,
    subscriptionId: string,
    contract: any,
    event: ContractEvent,
    checkDb = true,
  ) {
    const bmSubscriptionDetails = await this.constructBMSubscriptionDetails(
      billingModelId,
      subscriptionId,
      contract,
      event,
      checkDb,
    )
    await this.handleMissingBMRecord(billingModelId, contract, event)

    await this.bmSubscriptionsService.create(bmSubscriptionDetails)
  }

  public async handlePPCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb = true,
  ) {
    const pullPaymentDetails = await this.constructPullPaymentDetails(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      eventLog.returnValues.pullPaymentID,
      eventLog.transactionHash,
      contract,
      event,
      checkDb,
    )
    await this.handleBMSubscriptionCreateOrEditEvent(
      eventLog.returnValues.billingModelID,
      eventLog.returnValues.subscriptionID,
      contract,
      event,
      checkDb,
    )

    await this.pullPaymentService.create(pullPaymentDetails)
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
    // console.log('=================================================')
    // console.log('unserializedBillingModel', unserializedBillingModel)
    // console.log('=================================================')
    const billingModelDetails = serializeBMDetails(
      billingModelId,
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )

    if (checkDb) {
      const dbRecord = await this.billingModelService.retrieveByBlockchainId(
        billingModelId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) billingModelDetails.id = dbRecord.id
    }
    // console.log('=================================================')
    // console.log('billingModelDetails', billingModelDetails)
    // console.log('=================================================')
    return billingModelDetails
  }

  private async constructBMSubscriptionDetails(
    billingModelId: string,
    subscriptionId: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    const unserializedSubscription: UnserializedBMSubscription =
      await contract.methods.getSubscription(subscriptionId).call()
    // console.log('=================================================')
    // console.log('unserializedSubscription', unserializedSubscription)
    // console.log('=================================================')
    const subscriptionDetails = serializeBMSubscription(
      billingModelId,
      subscriptionId,
      event.contractAddress,
      event.networkId,
      event.contract.contractName ===
        String(SmartContractNames.recurringDynamicPP)
        ? unserializedSubscription[0]
        : unserializedSubscription,
    )

    if (checkDb) {
      const dbRecord = await this.bmSubscriptionsService.retrieveByBlockchainId(
        billingModelId,
        subscriptionId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) subscriptionDetails.id = dbRecord.id
    }
    // console.log('=================================================')
    // console.log('subscriptionDetails', subscriptionDetails)
    // console.log('=================================================')
    return subscriptionDetails
  }

  private async constructPullPaymentDetails(
    billingModelId: string,
    subscriptionId: string,
    pullPaymentId: string,
    transactionHash: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    const unserializedPullPayment: UnserializedPullPayment =
      await contract.methods.getPullPayment(pullPaymentId).call()

    const pullPaymentDetails = await serializePullPayment(
      pullPaymentId,
      subscriptionId,
      billingModelId,
      event.contractAddress,
      event.networkId,
      unserializedPullPayment,
      transactionHash,
      this.web3Helper.getWeb3Instance(contract.networkId),
    )

    if (checkDb) {
      const dbRecord = await this.pullPaymentService.retrieveByBlockchainId(
        billingModelId,
        subscriptionId,
        pullPaymentId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) pullPaymentDetails.id = dbRecord.id
    }

    return pullPaymentDetails
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
