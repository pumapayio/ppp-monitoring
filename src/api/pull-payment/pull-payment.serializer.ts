import { BigNumber } from 'bignumber.js'
import { CreatePullPaymentDto } from './dto/create-pull-payment.dto'

export interface UnserializedPullPayment {
  billingModelID: string
  subscriptionID: string
  paymentAmount: BigNumber
  executionTimestamp: string
}

export function serializePullPayment(
  pullPaymentId: string,
  bmSubscriptionId: string,
  pullPayment: UnserializedPullPayment,
): CreatePullPaymentDto {
  return {
    pullPaymentId,
    bmSubscriptionId,
    paymentAmount: String(pullPayment.paymentAmount),
    executionTimestamp: pullPayment.executionTimestamp,
  } as CreatePullPaymentDto
}
