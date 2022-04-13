import { BigNumber } from 'bignumber.js'
import { CreatePullPaymentDto } from './dto/create-pull-payment.dto'

export interface UnserializedPullPayment {
  billingModelID: string
  subscriptionID: string
  pullPaymentID: string
  paymentAmount: BigNumber
  executionTimestamp: string
}

export function serializePullPayment(
  pullPaymentId: string,
  bmSubscriptionId: string,
  billingModelId: string,
  contractAddress: string,
  networkId: string,
  pullPayment: UnserializedPullPayment,
): CreatePullPaymentDto {
  return {
    pullPaymentId,
    bmSubscriptionId,
    billingModelId,
    contractAddress,
    networkId,
    paymentAmount: String(pullPayment.paymentAmount),
    executionTimestamp: pullPayment.executionTimestamp,
  } as CreatePullPaymentDto
}
