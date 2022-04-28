import { BigNumber } from 'bignumber.js'
import { CreateBMDto } from './dto/createBM.dto'

// Unserialized entity means whatever objects we retrieve from the blockchain
export interface UnserializedBillingModel {
  payee: string
  creationTime: string
  subscriptionIDs: string[]
  name?: string
  amount?: BigNumber
  frequency?: BigNumber
  numberOfPayments?: string
  settlementToken?: string
}

export function serializeBMDetails(
  billingModelId: string,
  contractAddress: string,
  networkId: string,
  bm: UnserializedBillingModel,
  web3Utils,
): CreateBMDto {
  return {
    billingModelId,
    contractAddress,
    networkId,
    payee: bm.payee,
    subscriptionIDs: bm.subscriptionIDs,
    blockCreationTime: bm.creationTime,
    name: bm.name ? web3Utils.hexToUtf8(bm.name) : null,
    amount: bm.amount ? String(bm.amount) : null,
    settlementToken: bm.settlementToken ? bm.settlementToken : null,
    sellingToken: bm.settlementToken ? bm.settlementToken : null,
    numberOfPayments: bm.numberOfPayments ? bm.numberOfPayments : null,
    frequency: bm.frequency ? String(bm.frequency) : null,
  } as CreateBMDto
}
