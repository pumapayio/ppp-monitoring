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
        [ChainId.BSC_MAINNET]: '0xc9fdd1778b659E051290E40bdBbd88709FD56900',
        [ChainId.BSC_TESTNET]: '0xc9fdd1778b659E051290E40bdBbd88709FD56900',
      },
      [SmartContractNames.coreRegistry]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0xb74FE07AbB552d9c05ebE08A8bC956aEf51D6B03',
        [ChainId.BSC_TESTNET]: '0xb74FE07AbB552d9c05ebE08A8bC956aEf51D6B03',
      },
      [SmartContractNames.ppRegistry]: {
        [ChainId.BSC_MAINNET]: '0x9B14FDbA0031D314A67c1bd27232a755F321dF2F',
        [ChainId.BSC_TESTNET]: '0x9B14FDbA0031D314A67c1bd27232a755F321dF2F',
      },
      [SmartContractNames.singlePP]: {
        [ChainId.BSC_MAINNET]: '0xCc6b2D6f14f6cC6D7009B96A6cf3855dAd44c7f0',
        [ChainId.BSC_TESTNET]: '0xCc6b2D6f14f6cC6D7009B96A6cf3855dAd44c7f0',
      },
      [SmartContractNames.singleDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0xa1a6bB74C5e82625166983620d0d68986Bf7e739',
        [ChainId.BSC_TESTNET]: '0xa1a6bB74C5e82625166983620d0d68986Bf7e739',
      },
      [SmartContractNames.recurringPP]: {
        [ChainId.BSC_MAINNET]: '0x47F3A91207a2bf119D9699a4E5b4D7F6C1BA5E05',
        [ChainId.BSC_TESTNET]: '0x47F3A91207a2bf119D9699a4E5b4D7F6C1BA5E05',
      },
      [SmartContractNames.recurringPPFreeTrial]: {
        [ChainId.BSC_MAINNET]: '0xEdB12AD30dEc412F3ce7859DFFDd82a107fFa6E5',
        [ChainId.BSC_TESTNET]: '0xEdB12AD30dEc412F3ce7859DFFDd82a107fFa6E5',
      },
      [SmartContractNames.recurringPPPaidTrial]: {
        [ChainId.BSC_MAINNET]: '0xB75A3b4A4DA2F2043Ed5Fc6d92669821C4d2f846',
        [ChainId.BSC_TESTNET]: '0xB75A3b4A4DA2F2043Ed5Fc6d92669821C4d2f846',
      },
      [SmartContractNames.recurringDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0xDa4Ef6C94d7477cc77FDf5c00F55242A37c37883',
        [ChainId.BSC_TESTNET]: '0xDa4Ef6C94d7477cc77FDf5c00F55242A37c37883',
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
      default:
        return [
          'https://data-seed-prebsc-1-s1.binance.org:8545/',
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
          'https://data-seed-prebsc-2-s3.binance.org:8545/',
        ]
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
      default:
        // TODO: We must have a list of providers to connect to
        return [
          'wss://speedy-nodes-nyc.moralis.io/b45a15b599467a06fc2b10b6/bsc/testnet/ws',
        ]
    }
  }
}
