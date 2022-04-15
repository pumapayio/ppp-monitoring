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
}

export enum SmartContractNames {
  erc20 = <any>'erc20',
  coreRegistry = <any>'coreRegistry',
  ppRegistry = <any>'ppRegistry',
  executor = <any>'executor',
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
}

export interface NewSubscriptionEvent {
  billingModelID: string
  subscriptionID: string
  payee: string
}

export interface SinglePPNewSubscriptionEvent extends NewSubscriptionEvent {
  pullPaymentID: string
}

export interface BillingModelEditedEvent {
  billingModelID: string
  newName: string
  amount: string
  settlementToken: string
  oldPayee: string
  newPayee: string
}

export interface PullPayementExecutionEvent {}

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
      [SmartContractNames.executor]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0xf3DFdD67B71e376F25eeb9AD0810ae6Ed1b6C2f2',
        [ChainId.BSC_TESTNET]: '0xf3DFdD67B71e376F25eeb9AD0810ae6Ed1b6C2f2',
      },
      [SmartContractNames.coreRegistry]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0x042ff2864379bA7DaA3CF8056Da8b0a26fC30a91',
        [ChainId.BSC_TESTNET]: '0x042ff2864379bA7DaA3CF8056Da8b0a26fC30a91',
      },
      [SmartContractNames.ppRegistry]: {
        [ChainId.BSC_MAINNET]: '0x0dB6e41dC4e9a35A06C39925AC4e5116a6c9B81b',
        [ChainId.BSC_TESTNET]: '0x0dB6e41dC4e9a35A06C39925AC4e5116a6c9B81b',
      },
      [SmartContractNames.singlePP]: {
        [ChainId.BSC_MAINNET]: '0x54E9AAE440949Df2f38B9beE32F5927c5165775B',
        [ChainId.BSC_TESTNET]: '0x54E9AAE440949Df2f38B9beE32F5927c5165775B',
      },
      [SmartContractNames.singleDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0x332ecA38B2270cCA73695FD2EDfc7F8d85bF5a84',
        [ChainId.BSC_TESTNET]: '0x332ecA38B2270cCA73695FD2EDfc7F8d85bF5a84',
      },
      [SmartContractNames.recurringPP]: {
        [ChainId.BSC_MAINNET]: '0xA8Cb69dB2678beEC2fa0b24520bEC21D24A4181A',
        [ChainId.BSC_TESTNET]: '0xA8Cb69dB2678beEC2fa0b24520bEC21D24A4181A',
      },
      [SmartContractNames.recurringPPFreeTrial]: {
        [ChainId.BSC_MAINNET]: '0x0f7f9bc34DF6b8Dd699297C6561634e7A8F34B26',
        [ChainId.BSC_TESTNET]: '0x0f7f9bc34DF6b8Dd699297C6561634e7A8F34B26',
      },
      [SmartContractNames.recurringPPPaidTrial]: {
        [ChainId.BSC_MAINNET]: '0xDB727d306e4de2D26d481e6C076F8732C0b49B88',
        [ChainId.BSC_TESTNET]: '0xDB727d306e4de2D26d481e6C076F8732C0b49B88',
      },
      [SmartContractNames.recurringDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0x919bf289D2a7799E5318a9F92E02b7fAAEDe7184',
        [ChainId.BSC_TESTNET]: '0x919bf289D2a7799E5318a9F92E02b7fAAEDe7184',
      },
    }
    return smartContractAddresses[`${contractType}`][networkId]
  }

  public static GET_RPC_URL(networkId: string): string[] {
    switch (networkId) {
      case ChainId.BSC_MAINNET:
        // TODO: We must have a list of providers to connect to
        return ['https://bsc-dataseed.binance.org/']
      case ChainId.BSC_TESTNET:
      // Default to BSC Testnet
      default:
        // TODO: We must have a list of providers to connect to
        return ['https://data-seed-prebsc-2-s3.binance.org:8545/']
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
      // Default to BSC Testnet
      default:
        // TODO: We must have a list of providers to connect to
        return [
          'wss://speedy-nodes-nyc.moralis.io/b45a15b599467a06fc2b10b6/bsc/testnet/ws',
        ]
    }
  }
}
