import { Contract } from '../../api/contract/contract.entity'
import { Factory, Seeder } from 'typeorm-seeding'

export class CreateContracts implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const networks = process.env.SUPPORTED_NETWORKS
    const {
      blockchainEventsData,
    } = require('../../../resources/blockchainData.js')

    JSON.parse(networks).map((networkId) => {
      blockchainEventsData[networkId].map(async (contract) => {
        await factory(Contract)()
          .map(async (contr) => {
            contr.contractName = contract.contractName
            contr.address = contract.address
            contr.networkId = String(contract.networkId)
            contr.abi = JSON.stringify(contract.abi)

            return contr
          })
          .create()
      })
    })
  }
}
