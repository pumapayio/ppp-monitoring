import { BigNumber } from 'bignumber.js'
import { CreateBMDto } from './dto/createBM.dto'

// Unserialized entity means whatever objects we retrieve from the blockchain
export interface UnserializedBillingModel {
  payee: string
  creationTime: string
  subscriptionIDs: string[]
  uniqueReference: string
  merchantName?: string
  merchantURL?: string
  name?: string
  amount?: BigNumber
  frequency?: BigNumber
  numberOfPayments?: string
  settlementToken?: string
  trialPeriod?: string
  initialAmount?: string
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
    uniqueReference: bm.uniqueReference,
    merchantName: bm.merchantName ? bm.merchantName : null,
    merchantURL: bm.merchantURL ? bm.merchantURL : null,
    name: bm.name ? bm.name : null,
    amount: bm.amount ? String(bm.amount) : null,
    // once we introduce the selling token, we
    // will adjust the two lines below
    settlementToken: bm.settlementToken ? bm.settlementToken : null,
    sellingToken: bm.settlementToken ? bm.settlementToken : null,
    numberOfPayments: bm.numberOfPayments ? bm.numberOfPayments : null,
    frequency: bm.frequency ? String(bm.frequency) : null,
    trialPeriod: bm.trialPeriod ? String(bm.trialPeriod) : null,
    initialAmount: bm.initialAmount ? String(bm.initialAmount) : null,
  } as CreateBMDto
}
