import { BigNumber } from 'bignumber.js'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'

export interface UnserializedBMSubscription {
  billingModelID: string
  subscriber: string
  paymentAmount?: BigNumber
  amount?: BigNumber
  settlementToken: string
  paymentToken: string
  numberOfPayments?: string
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
    subscriber: bmSubscription.subscriber,
    paymentAmount: String(
      bmSubscription.paymentAmount
        ? bmSubscription.paymentAmount
        : bmSubscription.amount,
    ),
    settlementToken: bmSubscription.settlementToken,
    paymentToken: bmSubscription.paymentToken,
    token: bmSubscription.settlementToken,
    numberOfPayments: bmSubscription.numberOfPayments,
    startTimestamp: bmSubscription.startTimestamp,
    cancelTimestamp: bmSubscription.cancelTimestamp,
    nextPaymentTimestamp: bmSubscription.nextPaymentTimestamp,
    lastPaymentTimestamp: bmSubscription.lastPaymentTimestamp,
    pullPaymentIDs: bmSubscription.pullPaymentIDs,
  } as CreateBMSubscriptionDto
}
