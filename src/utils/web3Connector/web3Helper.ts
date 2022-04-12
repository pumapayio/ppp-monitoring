import { Injectable } from '@nestjs/common'
import Web3 from 'web3'
import { BlockchainGlobals, SmartContractNames } from '../blockchain'
import { SmartContractReader } from '../smartContractReader'
import { Web3Connector } from './web3Connector'

@Injectable()
export class Web3Helper {
  public constructor(private smartContractReader: SmartContractReader) {
    Web3Connector.getInstance()
  }

  public getWeb3Instance(networkID: number, useWSProvider = false): Web3 {
    if (useWSProvider) {
      // TODO: We need to implement logic such that we can rotate the RPC urls
      // and not always use the one at index 0
      const rpcUrl = BlockchainGlobals.GET_RPC_WS_URL(networkID)[0]
      Web3Connector.instantiateWsProvider(networkID, rpcUrl)

      return Web3Connector.getWeb3WsProvider(networkID)
    } else {
      // TODO: We need to implement logic such that we can rotate the RPC urls
      // and not always use the one at index 0
      const rpcUrl = BlockchainGlobals.GET_RPC_URL(networkID)[0]
      Web3Connector.instantiateHttpProvider(networkID, rpcUrl)

      return Web3Connector.getWeb3HttpProvider(networkID)
    }
  }

  public getWeb3Utils(networkID: number) {
    const web3 = this.getWeb3Instance(networkID)
    return web3.utils
  }

  public async getContractInstance(
    networkID: number,
    contractAddress: string,
    contractType: SmartContractNames | string,
    useWSProvider = false,
  ): Promise<any> {
    const web3 = this.getWeb3Instance(networkID, useWSProvider)
    const contractAbi = JSON.parse(
      await this.smartContractReader.readABI(
        BlockchainGlobals.GET_ABI_NAMES()[SmartContractNames[contractType]],
      ),
    )

    return new web3.eth.Contract(contractAbi, contractAddress)
  }
}
