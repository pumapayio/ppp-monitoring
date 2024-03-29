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

@Injectable()
export class RecurringPullPaymentEventHandler {
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

    return await this.billingModelService.create(billingModelDetails)
  }

  public async handleBMSubscriptionCreateOrEditEvent(
    billingModelId: string,
    subscriptionId: string,
    contract: any,
    event: ContractEvent,
    checkDb = true,
  ) {
    try {
      const bmSubscriptionDetails = await this.constructBMSubscriptionDetails(
        billingModelId,
        subscriptionId,
        contract,
        event,
        checkDb,
      )
      const billingModel = await this.handleMissingBMRecord(
        billingModelId,
        contract,
        event,
      )

      const createBMSubscription = await this.bmSubscriptionsService.create(
        bmSubscriptionDetails,
      )
      createBMSubscription.billingModel = billingModel

      return createBMSubscription
    } catch (error) {
      console.log('error: ', error)
    }
  }

  public async handlePPCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb = true,
  ) {
    try {
      const pullPaymentDetails = await this.constructPullPaymentDetails(
        eventLog.returnValues.billingModelID,
        eventLog.returnValues.subscriptionID,
        eventLog.returnValues.pullPaymentID,
        eventLog.transactionHash,
        contract,
        event,
        eventLog,
        checkDb,
      )
      const bmSubscription = await this.handleBMSubscriptionCreateOrEditEvent(
        eventLog.returnValues.billingModelID,
        eventLog.returnValues.subscriptionID,
        contract,
        event,
        checkDb,
      )
      const createdPPDetails = await this.pullPaymentService.create(
        pullPaymentDetails,
      )
      createdPPDetails.bmSubscription = bmSubscription

      return createdPPDetails
    } catch (error) {
      console.log('error:', error)
    }
  }

  private async constructBMDetails(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    try {
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
    } catch (error) {
      console.log('error: ', error)
    }
  }

  private async constructBMSubscriptionDetails(
    billingModelId: string,
    subscriptionId: string,
    contract: any,
    event: ContractEvent,
    checkDb: boolean,
  ) {
    try {
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
        const dbRecord =
          await this.bmSubscriptionsService.retrieveByBlockchainId(
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
    } catch (error) {
      console.log('error: ', error)
    }
  }

  private async constructPullPaymentDetails(
    billingModelId: string,
    subscriptionId: string,
    pullPaymentId: string,
    transactionHash: string,
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    checkDb: boolean,
  ) {
    try {
      const pullPaymentDetails = await serializePullPayment(
        pullPaymentId,
        subscriptionId,
        billingModelId,
        event.contractAddress,
        event.networkId,
        transactionHash,
        eventLog,
        this.web3Helper.getWeb3Instance(event.networkId),
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
    } catch (error) {
      console.log('error: ', error)
    }
  }

  private async handleMissingBMRecord(
    billingModelId: string,
    contract: any,
    event: ContractEvent,
  ) {
    try {
      const dbRecord = await this.billingModelService.retrieveByBlockchainId(
        billingModelId,
        event.contractAddress,
        event.networkId,
      )
      if (dbRecord) return dbRecord
      // no need to check from the db as we just did above
      // and we know that the record doesn't exist
      return await this.handleBMCreateOrEditEvent(
        billingModelId,
        contract,
        event,
        false,
      )
    } catch (error) {
      console.log('error: ', error)
    }
  }
}
