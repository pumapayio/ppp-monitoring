import { IsNotEmpty } from 'class-validator'

export class CreatePullPaymentDto {
  @IsNotEmpty()
  pullPaymentID: string

  @IsNotEmpty()
  subscriptionID: string

  @IsNotEmpty()
  paymentAmount: string

  @IsNotEmpty()
  executionTimestamp: string
}
