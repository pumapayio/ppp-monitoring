import { IsNotEmpty } from 'class-validator'

export class CreatePullPaymentDto {
  // to be used in case we want to do create or update
  id?: string

  @IsNotEmpty()
  pullPaymentId: string

  @IsNotEmpty()
  bmSubscriptionId: string

  @IsNotEmpty()
  contractAddress: string

  @IsNotEmpty()
  networkId: string

  @IsNotEmpty()
  paymentAmount: string

  @IsNotEmpty()
  executionAmount: string

  @IsNotEmpty()
  receivingAmount: string

  @IsNotEmpty()
  executionTimestamp: string
}
