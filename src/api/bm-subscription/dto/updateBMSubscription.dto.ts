import { IsNotEmpty } from 'class-validator'

export class UpdateBMSubscriptionDto {
  @IsNotEmpty()
  subscriptionId: string

  billingModelId?: string
  subscriber?: string
  paymentToken?: string
  numberOfPayments?: string
  startTimestamp?: string
  cancelTimestamp?: string
  nextPaymentTimestamp?: string
  lastPaymentTimestamp?: string
}
