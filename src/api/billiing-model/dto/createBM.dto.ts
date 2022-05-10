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
  blockCreationTime: string
  @IsNotEmpty()
  payee: string
  // The rest are optional since we have
  // single and recurring dynamic billing models
  name?: string
  amount?: string
  merchantName?: string
  merchantURL?: string
  uniqueReference?: string
  sellingToken?: string
  settlementToken?: string
  frequency?: string
  numberOfPayments?: string

  trialPeriod?: string
  initialAmount?: string
}
