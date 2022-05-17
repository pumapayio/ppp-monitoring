import { BigNumber } from 'bignumber.js'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'

export interface UnserializedBMSubscription {
  billingModelID: string
  subscriber: string
  paymentAmount?: BigNumber
  amount?: BigNumber
  settlementToken: string
  uniqueReference: string
  paymentToken: string
  numberOfPayments?: string
  remainingPayments?: string // in case of dynamic recurring
  startTimestamp?: string
  cancelTimestamp?: string
  nextPaymentTimestamp?: string
  lastPaymentTimestamp?: string
  pullPaymentIDs: string[]
}

export function serializeBMSubscription(
  billingModelId: string,
  bmSubscriptionId: string,
  contractAddress: string,
  networkId: string,
  bmSubscription: UnserializedBMSubscription,
): CreateBMSubscriptionDto {
  return {
    billingModelId,
    bmSubscriptionId,
    networkId,
    contractAddress,
    uniqueReference: bmSubscription.uniqueReference,
    subscriber: bmSubscription.subscriber,
    paymentAmount: String(
      bmSubscription.paymentAmount
        ? bmSubscription.paymentAmount
        : bmSubscription.amount,
    ),
    settlementToken: bmSubscription.settlementToken,
    paymentToken: bmSubscription.paymentToken,
    token: bmSubscription.settlementToken,
    remainingNumberOfPayments: bmSubscription.numberOfPayments
      ? bmSubscription.numberOfPayments
      : bmSubscription.remainingPayments,
    startTimestamp: bmSubscription.startTimestamp,
    cancelTimestamp: bmSubscription.cancelTimestamp,
    nextPaymentTimestamp: bmSubscription.nextPaymentTimestamp,
    lastPaymentTimestamp: bmSubscription.lastPaymentTimestamp,
    pullPaymentIDs: bmSubscription.pullPaymentIDs,
  } as CreateBMSubscriptionDto
}
