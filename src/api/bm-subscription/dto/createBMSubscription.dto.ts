import { IsNotEmpty } from 'class-validator'

export class CreateBMSubscriptionDto {
  @IsNotEmpty()
  bmSubscriptionId: string

  @IsNotEmpty()
  billingModelId: string

  @IsNotEmpty()
  contractAddress: string

  @IsNotEmpty()
  networkId: string

  @IsNotEmpty()
  subscriber: string

  @IsNotEmpty()
  paymentToken: string

  // The below will be empty for single pull payments, therefore are optional
  numberOfPayments?: string
  startTimestamp?: string
  cancelTimestamp?: string
  nextPaymentTimestamp?: string
  lastPaymentTimestamp?: string
}
