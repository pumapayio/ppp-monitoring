import { BigNumber } from 'bignumber.js'
import { CreateBMDto } from './dto/createBM.dto'

// Unserialized entity means whatever objects we retrieve from the blockchain
export interface UnserializedBillingModel {
  payee: string
  name: string
  amount: BigNumber
  frequency: BigNumber
  numberOfPayments: string
  settlementToken: string
  subscriptionIDs: string[]
}

export function serializeBMDetails(
  billingModelId: string,
  contractAddress: string,
  networkId: string,
  bmDetails: UnserializedBillingModel,
  web3Utils,
): CreateBMDto {
  return {
    billingModelId,
    contractAddress,
    networkId,
    payee: bmDetails.payee,
    name: web3Utils.hexToUtf8(bmDetails.name),
    amount: String(bmDetails.amount),
    settlementToken: bmDetails.settlementToken,
    sellingToken: bmDetails.settlementToken,
    numberOfPayments: bmDetails.numberOfPayments,
    frequency: String(bmDetails.frequency),
    subscriptionIDs: bmDetails.subscriptionIDs,
  } as CreateBMDto
}
