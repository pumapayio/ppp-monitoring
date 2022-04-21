import { IsNotEmpty } from 'class-validator'

export class CreateBMDto {
  // to be used in case we want to do create or update
  id?: string

  @IsNotEmpty()
  billingModelId: string

  @IsNotEmpty()
  contractAddress: string

  @IsNotEmpty()
  networkId: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  payee: string

  @IsNotEmpty()
  amount: string

  @IsNotEmpty()
  sellingToken: string

  @IsNotEmpty()
  settlementToken: string

  frequency?: string
  numberOfPayments?: string
}
