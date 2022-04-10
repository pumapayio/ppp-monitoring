import { Factory, Seeder } from 'typeorm-seeding'
import { ContractEvent } from '../../../src/api/contract-event/contract-event.entity'

export class CreateContractEvents implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const data = require('../../../resources/blockchain-events.json')

    for (let contract of data) {
      for (let event of contract.events) {
        await factory(ContractEvent)()
          .map(async (contractEvent) => {
            contractEvent.eventName = event.eventName
            contractEvent.topic = event.topic
            contractEvent.contractName = contract.contractName
            contractEvent.address = contract.address
            contractEvent.abi = JSON.stringify(contract.abi)
            contractEvent.networkId = contract.networkId
            contractEvent.lastSyncedBlock = contract.blockNumber
            contractEvent.isSyncing = false
            contractEvent.syncHistorical = false

            return contractEvent
          })
          .create()
      }
    }
  }
}
