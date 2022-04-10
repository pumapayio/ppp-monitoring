import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateBMSubscriptionDto {
  @IsNotEmpty()
  subscriptionID: string

  @IsNotEmpty()
  billingModelID: string

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
