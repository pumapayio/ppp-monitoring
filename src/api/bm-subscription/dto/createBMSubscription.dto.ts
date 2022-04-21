import { IsNotEmpty } from 'class-validator'

export class CreateBMSubscriptionDto {
  // to be used in case we want to do create or update
  id?: string

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
