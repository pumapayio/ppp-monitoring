import { Injectable } from '@nestjs/common'
import { BlockchainGlobals, SmartContractNames } from '../blockchain'
import { SmartContractReader } from '../smartContractReader'
import { Web3Connector } from './web3Connector'
import Web3 from 'web3'
import * as _ from 'lodash'

@Injectable()
export class Web3Helper {
  public constructor(private smartContractReader: SmartContractReader) {
    Web3Connector.getInstance()
  }

  public getWeb3Instance(networkId: string, useWSProvider = false): Web3 {
    if (useWSProvider) {
      const rpcUrl = _.sample(BlockchainGlobals.GET_RPC_WS_URL(networkId))
      Web3Connector.instantiateWsProvider(networkId, rpcUrl)

      return Web3Connector.getWeb3WsProvider(networkId)
    } else {
      const rpcUrl = _.sample(BlockchainGlobals.GET_RPC_URL(networkId))
      Web3Connector.instantiateHttpProvider(networkId, rpcUrl)

      return Web3Connector.getWeb3HttpProvider(networkId)
    }
  }

  public getWeb3Utils(networkId: string) {
    const web3 = this.getWeb3Instance(networkId)
    return web3.utils
  }

  public async getContractInstance(
    networkId: string,
    contractAddress: string,
    contractType: SmartContractNames | string,
    useWSProvider = false,
  ): Promise<any> {
    const web3 = this.getWeb3Instance(networkId, useWSProvider)
    const contractAbi = JSON.parse(
      await this.smartContractReader.readABI(
        BlockchainGlobals.GET_ABI_NAMES()[SmartContractNames[contractType]],
      ),
    )

    return new web3.eth.Contract(contractAbi, contractAddress)
  }
}
