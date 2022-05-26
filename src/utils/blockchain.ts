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
        [ChainId.BSC_MAINNET]: '0xb2a80b679f87530edfb848708ca948cbf25ca3e0',
        [ChainId.BSC_TESTNET]: '0xb2a80b679f87530edfb848708ca948cbf25ca3e0',
      },
      [SmartContractNames.executor]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0x286d4B4306ef74e68c7F2BAd529648812503593e',
        [ChainId.BSC_TESTNET]: '0x286d4B4306ef74e68c7F2BAd529648812503593e',
      },
      [SmartContractNames.coreRegistry]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0x5358A28A3fdFD3e43DF0Ec0dE2Cdaf6c1365E572',
        [ChainId.BSC_TESTNET]: '0x5358A28A3fdFD3e43DF0Ec0dE2Cdaf6c1365E572',
      },
      [SmartContractNames.ppRegistry]: {
        [ChainId.BSC_MAINNET]: '0xb66FDF8e16C78a20c4742867EBA5d6e08a37F451',
        [ChainId.BSC_TESTNET]: '0xb66FDF8e16C78a20c4742867EBA5d6e08a37F451',
      },
      [SmartContractNames.singlePP]: {
        [ChainId.BSC_MAINNET]: '0xcD8Fd4dDee80f3f27845e74faa12fF6720975B4c',
        [ChainId.BSC_TESTNET]: '0xcD8Fd4dDee80f3f27845e74faa12fF6720975B4c',
      },
      [SmartContractNames.singleDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0xaffa2db1641273485365D526a2a9218E06803afc',
        [ChainId.BSC_TESTNET]: '0xaffa2db1641273485365D526a2a9218E06803afc',
      },
      [SmartContractNames.recurringPP]: {
        [ChainId.BSC_MAINNET]: '0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba',
        [ChainId.BSC_TESTNET]: '0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba',
      },
      [SmartContractNames.recurringPPFreeTrial]: {
        [ChainId.BSC_MAINNET]: '0xaafE33394Dc1d7A3e117399FE9F959Bc8FCf5588',
        [ChainId.BSC_TESTNET]: '0xaafE33394Dc1d7A3e117399FE9F959Bc8FCf5588',
      },
      [SmartContractNames.recurringPPPaidTrial]: {
        [ChainId.BSC_MAINNET]: '0x2e9b5d0B090c067177A52a78763BcA371f49f71f',
        [ChainId.BSC_TESTNET]: '0x2e9b5d0B090c067177A52a78763BcA371f49f71f',
      },
      [SmartContractNames.recurringDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0xb0eBD14E3555b65941eD603923875465f6Daa6Ab',
        [ChainId.BSC_TESTNET]: '0xb0eBD14E3555b65941eD603923875465f6Daa6Ab',
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
