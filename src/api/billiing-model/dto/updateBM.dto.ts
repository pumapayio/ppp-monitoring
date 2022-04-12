import { IsNotEmpty } from 'class-validator'

export class UpdateBMDto {
  @IsNotEmpty()
  billingModelId: string

  @IsNotEmpty()
  payee: string

  @IsNotEmpty()
  settlementToken: string

  sellingToken?: string
  amount?: string // We cannot update amount for Recurring BMs
  name?: string // We cannot update name for dynamic BMs
}
