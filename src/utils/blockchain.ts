import { Injectable } from '@nestjs/common'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'

export enum ChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  BSC_MAINNET = 56,
  BSC_TESTNET = 97,
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
  returnValues: any | BillingModelCreatedEvent
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
    networkID: number,
    contractType: SmartContractNames,
  ): string {
    const smartContractAddresses = {
      [SmartContractNames.executor]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0x91Caf788aC830B86e7F1F58636f969d035D430e0',
        [ChainId.BSC_TESTNET]: '0x91Caf788aC830B86e7F1F58636f969d035D430e0',
      },
      [SmartContractNames.coreRegistry]: {
        // TODO: Update the contract addresses for BSC mainnet
        [ChainId.BSC_MAINNET]: '0xF9F90e84605dd7435374d6D7e54487153807F038',
        [ChainId.BSC_TESTNET]: '0xF9F90e84605dd7435374d6D7e54487153807F038',
      },
      [SmartContractNames.ppRegistry]: {
        [ChainId.BSC_MAINNET]: '0x882B601889DC24D4D39c6ae4b68c04E87712571A',
        [ChainId.BSC_TESTNET]: '0x882B601889DC24D4D39c6ae4b68c04E87712571A',
      },
      [SmartContractNames.singlePP]: {
        [ChainId.BSC_MAINNET]: '0x3cf90aFd39cF1a093993C1a8cCfB6C7e3c3732Aa',
        [ChainId.BSC_TESTNET]: '0x3cf90aFd39cF1a093993C1a8cCfB6C7e3c3732Aa',
      },
      [SmartContractNames.singleDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0x558fbb9d3DC8e856DA50fD65faBBD8aA2Ff00218',
        [ChainId.BSC_TESTNET]: '0x558fbb9d3DC8e856DA50fD65faBBD8aA2Ff00218',
      },
      [SmartContractNames.recurringPP]: {
        [ChainId.BSC_MAINNET]: '0x65795187B842240e22A3A716EB1090a8A2e47D8C',
        [ChainId.BSC_TESTNET]: '0x65795187B842240e22A3A716EB1090a8A2e47D8C',
      },
      [SmartContractNames.recurringPPFreeTrial]: {
        [ChainId.BSC_MAINNET]: '0x007323d32DCca52F5cd70859C5EEc94306ce43B5',
        [ChainId.BSC_TESTNET]: '0x007323d32DCca52F5cd70859C5EEc94306ce43B5',
      },
      [SmartContractNames.recurringPPPaidTrial]: {
        [ChainId.BSC_MAINNET]: '0x421112a1E58f345D56371D7721F1CE1b02447a9F',
        [ChainId.BSC_TESTNET]: '0x421112a1E58f345D56371D7721F1CE1b02447a9F',
      },
      [SmartContractNames.recurringDynamicPP]: {
        [ChainId.BSC_MAINNET]: '0x9ff2E032D165143C5f0C472fB2a8aB3acF254a04',
        [ChainId.BSC_TESTNET]: '0x9ff2E032D165143C5f0C472fB2a8aB3acF254a04',
      },
    }
    return smartContractAddresses[`${contractType}`][networkID]
  }

  public static GET_RPC_URL(networkID: number): string[] {
    switch (networkID) {
      case ChainId.BSC_MAINNET:
        // TODO: We must have a list of providers to connect to
        return ['https://bsc-dataseed.binance.org/']
      case ChainId.BSC_TESTNET:
      // Default to BSC Testnet
      default:
        // TODO: We must have a list of providers to connect to
        return ['https://data-seed-prebsc-1-s1.binance.org:8545/']
    }
  }

  public static GET_RPC_WS_URL(networkID: number): string[] {
    switch (networkID) {
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
