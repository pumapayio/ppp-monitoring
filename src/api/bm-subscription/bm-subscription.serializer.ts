import { BigNumber } from 'bignumber.js'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'

export interface UnserializedBMSubscription {
  billingModelID: string
  subscriber: string
  paymentAmount: BigNumber
  settlementToken: string
  paymentToken: string
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
    paymentAmount: String(bmSubscription.paymentAmount),
    settlementToken: bmSubscription.settlementToken,
    paymentToken: bmSubscription.paymentToken,
    token: bmSubscription.settlementToken,
    pullPaymentIDs: bmSubscription.pullPaymentIDs,
  } as CreateBMSubscriptionDto
}
