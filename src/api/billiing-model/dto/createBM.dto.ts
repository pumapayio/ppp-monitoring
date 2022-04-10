import { IsNotEmpty, IsEmail } from 'class-validator'

export class CreateBMDto {
  @IsNotEmpty()
  billingModelID: string

  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  payee: string

  @IsNotEmpty()
  amount: string

  @IsNotEmpty()
  token: string

  frequency: string
  numberOfPayments: string
}
