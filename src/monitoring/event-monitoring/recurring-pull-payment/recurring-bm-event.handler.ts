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

export class RecurringBMEventHandler {
  public async handleBMCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    bmSubscriptionsService: BMSubscriptionService,
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

    await bmSubscriptionsService.create(serializedSubscription)
  }

  public async handlePPCreation(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    pullPaymentService: PullPaymentService,
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

    await pullPaymentService.create(serializedPullPayment)
  }

  public async updateBMForPullPaymentExecution(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
    bmSubscriptionsService: BMSubscriptionService,
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
    await bmSubscriptionsService.update(
      serializedSubscription,
      event.networkId,
      event.contractAddress,
    )
  }
}
