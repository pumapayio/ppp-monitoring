import { IsNotEmpty } from 'class-validator'

export class CreatePullPaymentDto {
  @IsNotEmpty()
  pullPaymentId: string

  @IsNotEmpty()
  bmSubscriptionId: string

  @IsNotEmpty()
  paymentAmount: string

  @IsNotEmpty()
  executionTimestamp: string
}
