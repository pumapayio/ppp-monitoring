import { BigNumber } from 'bignumber.js'

export interface UnserializedBMSubscription {
  billingModelID: string
  subscriber: string
  paymentAmount: BigNumber
  settlementToken: string
  paymentToken: string
  pullPaymentIDs: string[]
}

export interface SerializedBMSubscription {
  billingModelId: string
  bmSubscriptionId: string
  subscriber: string
  paymentAmount: string
  settlementToken: string
  paymentToken: string
  token: string // we keep this here for now until we figure out how we will handle the token names in general
  pullPaymentIDs: string[]
}

export function serializeBMSubscription(
  billingModelId: string,
  subscriptionId: string,
  bmSubscription: UnserializedBMSubscription,
): SerializedBMSubscription {
  return {
    billingModelId: billingModelId,
    bmSubscriptionId: subscriptionId,
    subscriber: bmSubscription.subscriber,
    paymentAmount: String(bmSubscription.paymentAmount),
    settlementToken: bmSubscription.settlementToken,
    paymentToken: bmSubscription.paymentToken,
    token: bmSubscription.settlementToken,
    pullPaymentIDs: bmSubscription.pullPaymentIDs,
  } as SerializedBMSubscription
}
