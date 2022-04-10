import { IsNotEmpty } from 'class-validator'

export class UpdateBMSubscriptionDto {
  @IsNotEmpty()
  subscriptionID: string

  billingModelID?: string
  subscriber?: string
  paymentToken?: string
  numberOfPayments?: string
  startTimestamp?: string
  cancelTimestamp?: string
  nextPaymentTimestamp?: string
  lastPaymentTimestamp?: string
}
