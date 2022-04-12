// import { ContractEventService } from './contract-event.service'
// import { ContractEventRepository } from './contract-event.repository'
// import { ContractEvent } from './contract-event.entity'

// describe('Contract Event Service', () => {
//   const data = require('../../../resources/blockchain-events.json')
//   let service: ContractEventService
//   let repository: ContractEventRepository

//   beforeEach(async () => {
//     repository = new ContractEventRepository()
//     jest
//       .spyOn(repository, 'save')
//       .mockImplementation((contractEvent) => contractEvent as any)
//     jest
//       .spyOn(repository, 'count')
//       .mockImplementation((_) => Promise.resolve(0))
//     jest.spyOn(repository, 'findOneOrFail').mockImplementation((_) =>
//       Promise.resolve({
//         id: 'some_id',
//         eventName: data[0].events[0].eventName,
//         topic: data[0].events[0].topic,
//         contractName: data[0].contractName,
//         address: data[0].address,
//         abi: JSON.stringify(data[0].abi),
//         networkId: data[0].networkId,
//         lastSyncedBlock: data[0].blockNumber,
//         isSyncing: false,
//         syncHistorical: false,
//       } as ContractEvent),
//     )

//     service = new ContractEventService(repository)
//   })
// })
