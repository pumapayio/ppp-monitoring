import { Injectable } from '@nestjs/common'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'

export enum ChainId {
  MAINNET = '1',
  ROPSTEN = '3',
  RINKEBY = '4',
  GÖRLI = '5',
  KOVAN = '42',
  BSC_MAINNET = '56',
  BSC_TESTNET = '97',
  MUMBAI = '80001',
  POLYGON = '137',
}

export enum SmartContractNames {
  erc20 = <any>'erc20',
  coreRegistry = <any>'coreRegistry',
  ppRegistry = <any>'ppRegistry',
  executor = <any>'executor',
  executorReceiver = <any>`executorReceiver`,
  singlePP = <any>'SinglePullPayment',
  singleDynamicPP = <any>'SingleDynamicPullPayment',
  recurringPP = <any>'RecurringPullPayment',
  recurringDynamicPP = <any>'RecurringDynamicPullPayment',
  recurringPPFreeTrial = <any>'RecurringPullPaymentWithFreeTrial',
  recurringPPPaidTrial = <any>'RecurringPullPaymentWithPaidTrial',
}

export interface ContractEventLog {
  address: string
  blockNumber: number
  transactionHash: string
  transactionIndex: number
  blockHash: string
  logIndex: number
  removed: boolean
  id: string
  returnValues:
    | any
    | BillingModelCreatedEvent
    | NewSubscriptionEvent
    | SinglePPNewSubscriptionEvent
    | BillingModelEditedEvent
  event: ContractEventTypes
  signature: string
  timestamp: string
  raw: {
    data: string
    topics: string[]
  }
}

export interface BillingModelCreatedEvent {
  billingModelID: string
  payee: string
  recurringPPType?: string
}

export interface NewSubscriptionEvent {
  billingModelID: string
  subscriptionID: string
  payee: string
  payer: string
}

export interface SinglePPNewSubscriptionEvent extends NewSubscriptionEvent {
  pullPaymentID: string
  executionFee: string
  userAmount: string
  receiverAmount: string
}

export interface BillingModelEditedEvent {
  billingModelID: string
  newName?: string
  amount?: string
  settlementToken?: string
  oldPayee: string
  newPayee: string
  newMerchantName: string
  newMerchantUrl: string
}

@Injectable()
export class BlockchainGlobals {
  constructor() {}

  public static GET_ABI_DIRECTORY(): string {
    return `${process.cwd()}/resources/smart-contract-abis/`
  }

  public static GET_ABI_NAMES(): any {
    return {
      [SmartContractNames.erc20]: 'erc20.abi.json',
      [SmartContractNames.executor]: 'executor.abi.json',
      [SmartContractNames.coreRegistry]: 'coreRegistry.abi.json',
      [SmartContractNames.ppRegistry]: 'ppRegistry.abi.json',
      [SmartContractNames.singlePP]: 'singlePP.abi.json',
      [SmartContractNames.singleDynamicPP]: 'singleDynamicPP.abi.json',
      [SmartContractNames.recurringPP]: 'recurringPP.abi.json',
      [SmartContractNames.recurringDynamicPP]: 'recurringDynamicPP.abi.json',
      [SmartContractNames.recurringPPFreeTrial]:
        'recurringPPFreeTrial.abi.json',
      [SmartContractNames.recurringPPPaidTrial]:
        'recurringPPPaidTrial.abi.json',
    }
  }

  public static GET_CONTRACT_ADDRESS(
    networkId: string,
    contractType: SmartContractNames,
  ): string {
    const smartContractAddresses = {
      // TODO: Need to retrieve the executor fee receiver from the blockchain
      [SmartContractNames.executorReceiver]: {
        // TODO: Update the contract addresses for BSC mainnet
        // [ChainId.BSC_MAINNET]: '0xb2a80b679f87530edfb848708ca948cbf25ca3e0',
        // [ChainId.BSC_TESTNET]: '0xb2a80b679f87530edfb848708ca948cbf25ca3e0',
        [ChainId.MUMBAI]: '0x03BFc5904c2e007fd6C66AcD0F0f2a549Ce82A70',
        [ChainId.POLYGON]: '0x03BFc5904c2e007fd6C66AcD0F0f2a549Ce82A70',
      },
      [SmartContractNames.executor]: {
        // TODO: Update the contract addresses for BSC mainnet
        // [ChainId.BSC_MAINNET]: '0x286d4B4306ef74e68c7F2BAd529648812503593e',
        // [ChainId.BSC_TESTNET]: '0x286d4B4306ef74e68c7F2BAd529648812503593e',
        [ChainId.MUMBAI]: '0x7Bf121c08661389777b29937f45a56Ada7d50488',
        [ChainId.POLYGON]: '0x643aA102BA6AABD1723Ec8F89555c371172b6B34',
      },
      [SmartContractNames.coreRegistry]: {
        // TODO: Update the contract addresses for BSC mainnet
        // [ChainId.BSC_MAINNET]: '0x5358A28A3fdFD3e43DF0Ec0dE2Cdaf6c1365E572',
        // [ChainId.BSC_TESTNET]: '0x5358A28A3fdFD3e43DF0Ec0dE2Cdaf6c1365E572',
        [ChainId.MUMBAI]: '0x748aD4aC8fFf077BD665125645408c9Bf66464F3',
        [ChainId.POLYGON]: '0x53F5aC045a598F09158429D1Ba0324C87830Eecf',
      },
      [SmartContractNames.ppRegistry]: {
        // [ChainId.BSC_MAINNET]: '0xb66FDF8e16C78a20c4742867EBA5d6e08a37F451',
        // [ChainId.BSC_TESTNET]: '0xb66FDF8e16C78a20c4742867EBA5d6e08a37F451',
        [ChainId.MUMBAI]: '0xe8D228cE0569feeaB47b9bC0e7e9e219104fF26c',
        [ChainId.POLYGON]: '0x3BFeD79946ee34cF39d6522F99F19041224F47c1',
      },
      [SmartContractNames.singlePP]: {
        // [ChainId.BSC_MAINNET]: '0xcD8Fd4dDee80f3f27845e74faa12fF6720975B4c',
        // [ChainId.BSC_TESTNET]: '0xcD8Fd4dDee80f3f27845e74faa12fF6720975B4c',
        [ChainId.MUMBAI]: '0x797E1631891fCd4Ef5f665f65FE4Eb0E67B7f51E',
        [ChainId.POLYGON]: '0x7684c8836AE64Db425C5381470cDE43d2437F3D6',
      },
      [SmartContractNames.singleDynamicPP]: {
        // [ChainId.BSC_MAINNET]: '0xaffa2db1641273485365D526a2a9218E06803afc',
        // [ChainId.BSC_TESTNET]: '0xaffa2db1641273485365D526a2a9218E06803afc',
        [ChainId.MUMBAI]: '0x9d65Db938064Ca45238Bd944ac10FB34F07B1159',
        [ChainId.POLYGON]: '0x931db345ec29533d5AfbE60D117797B13F941D5A',
      },
      [SmartContractNames.recurringPP]: {
        // [ChainId.BSC_MAINNET]: '0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba',
        // [ChainId.BSC_TESTNET]: '0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba',
        [ChainId.MUMBAI]: '0xEbb2135224Bfd7a5395c95B0e5A6a0493bF6e4Ba',
        [ChainId.POLYGON]: '0x05bB57B6863c5d6695fE7B113d4D16Ae89b46b48',
      },
      [SmartContractNames.recurringPPFreeTrial]: {
        // [ChainId.BSC_MAINNET]: '0xaafE33394Dc1d7A3e117399FE9F959Bc8FCf5588',
        // [ChainId.BSC_TESTNET]: '0xaafE33394Dc1d7A3e117399FE9F959Bc8FCf5588',
        [ChainId.MUMBAI]: '0xc3A9ccb1eE4A8998e89f5a35681e5226e3c61971',
        [ChainId.POLYGON]: '0x6DcB26FEc67F91cBc67a06C5aa541Dc0f56D9f66',
      },
      [SmartContractNames.recurringPPPaidTrial]: {
        // [ChainId.BSC_MAINNET]: '0x2e9b5d0B090c067177A52a78763BcA371f49f71f',
        // [ChainId.BSC_TESTNET]: '0x2e9b5d0B090c067177A52a78763BcA371f49f71f',
        [ChainId.MUMBAI]: '0xCd003B71c98B865Ee8f5806e225d885a29435834',
        [ChainId.POLYGON]: '0xB6aB194e7489Ec9476656ABF9890AB2bcfD254d7',
      },
      [SmartContractNames.recurringDynamicPP]: {
        // [ChainId.BSC_MAINNET]: '0xb0eBD14E3555b65941eD603923875465f6Daa6Ab',
        // [ChainId.MUMBAI]: '0x748aD4aC8fFf077BD665125645408c9Bf66464F3',
        [ChainId.POLYGON]: '0xdb27314a1ED596a669da759b2dc75308897Da767',
        [ChainId.BSC_TESTNET]: '0x691Ca8603e22e534aa68860076B052525c73c785',
      },
    }
    return smartContractAddresses[`${contractType}`][networkId]
  }

  public static GET_RPC_URL(networkId: string): string[] {
    switch (networkId) {
      case ChainId.BSC_MAINNET:
        // TODO: We must have a list of providers to connect to
        return [
          'https://bsc-dataseed.binance.org/',
          'https://bsc-dataseed2.binance.org/',
          'https://bsc-dataseed3.binance.org/',
          'https://bsc-dataseed4.binance.org',
        ]
      case ChainId.BSC_TESTNET:
      case ChainId.MUMBAI:
        return [
          'https://matic-mumbai.chainstacklabs.com',
          'https://rpc-mumbai.maticvigil.com/',
        ]
      case ChainId.POLYGON:
        return ['https://matic-mainnet.chainstacklabs.com/']

      default:
        return ['https://matic-mainnet.chainstacklabs.com/']
    }
  }

  public static GET_RPC_WS_URL(networkId: string): string[] {
    switch (networkId) {
      case ChainId.BSC_MAINNET:
        // TODO: We must have a list of providers to connect to
        return [
          'wss://speedy-nodes-nyc.moralis.io/b45a15b599467a06fc2b10b6/bsc/mainnet/ws',
        ]
      case ChainId.BSC_TESTNET:
      case ChainId.MUMBAI:
        return [
          'wss://polygon-mumbai.g.alchemy.com/v2/KXiGUUfDqYhWiLPVix3b_fm5MRFJEEKh',
        ]
      case ChainId.POLYGON:
        ;['']
      default:
        // TODO: We must have a list of providers to connect to
        return [
          'wss://polygon-mumbai.g.alchemy.com/v2/KXiGUUfDqYhWiLPVix3b_fm5MRFJEEKh',
        ]
    }
  }
}
