import { IsNotEmpty } from 'class-validator'

export class CreateBMSubscriptionDto {
  @IsNotEmpty()
  bmSubscriptionId: string

  @IsNotEmpty()
  billingModelId: string

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

  // billingModelId: string
  // bmSubscriptionId: string
  // subscriber: string
  // paymentAmount: string
  // settlementToken: string
  // paymentToken: string
  // token: string // we keep this here for now until we figure out how we will handle the token names in general
  // pullPaymentIDs: string[]
}
