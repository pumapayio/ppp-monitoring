import { BigNumber } from 'bignumber.js'

export interface UnserializedBillingModel {
  payee: string
  name: string
  amount: BigNumber
  settlementToken: string
  subscriptionIDs: string[]
}

export interface SerializedBillingModel {
  billingModelId: string
  payee: string
  name: string
  amount: string
  settlementToken: string
  token: string // we keep this here for now until we figure out how we will handle the token names in general
  subscriptionIDs: string[]
}

export function serializeBMDetails(
  billingModelId: string,
  bmDetails: UnserializedBillingModel,
  web3Utils,
): SerializedBillingModel {
  return {
    billingModelId: billingModelId,
    payee: bmDetails.payee,
    name: web3Utils.hexToUtf8(bmDetails.name),
    amount: String(bmDetails.amount),
    settlementToken: bmDetails.settlementToken,
    token: bmDetails.settlementToken,
    subscriptionIDs: bmDetails.subscriptionIDs,
  } as SerializedBillingModel
}
