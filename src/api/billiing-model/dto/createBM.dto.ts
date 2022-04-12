import { IsNotEmpty, IsEmail } from 'class-validator'

export class CreateBMDto {
  @IsNotEmpty()
  billingModelId: string

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
