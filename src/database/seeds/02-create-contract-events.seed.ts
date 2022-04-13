import { Factory, Seeder } from 'typeorm-seeding'
import { ContractEvent } from '../../api/contract-event/contract-event.entity'

export class CreateContractEvents implements Seeder {
  public async run(factory: Factory): Promise<void> {
    const data = require('../../../resources/blockchain-events.json')

    for (let contract of data) {
      for (let event of contract.events) {
        await factory(ContractEvent)()
          .map(async (contractEvent) => {
            contractEvent.eventName = event.eventName
            contractEvent.topic = event.topic
            contractEvent.contractAddress = contract.address
            contractEvent.networkId = String(contract.networkId)
            contractEvent.lastSyncedBlock = contract.blockNumber
            contractEvent.syncHistorical = event.syncHistorical

            return contractEvent
          })
          .create()
      }
    }
  }
}
