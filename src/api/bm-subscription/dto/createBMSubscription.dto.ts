import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateBMSubscriptionDto {
  @IsNotEmpty()
  subscriptionId: string

  @IsNotEmpty()
  billingModelId: string

  @IsNotEmpty()
  subscriber: string

  @IsNotEmpty()
  paymentToken: string

  @IsNotEmpty()
  numberOfPayments: string

  @IsNotEmpty()
  startTimestamp: string

  @IsNotEmpty()
  cancelTimestamp: string

  @IsNotEmpty()
  nextPaymentTimestamp: string

  @IsNotEmpty()
  lastPaymentTimestamp: string
}
