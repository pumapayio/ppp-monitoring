import { EntityRepository, Repository } from 'typeorm'
import { ContractEvent } from './contract-event.entity'

@EntityRepository(ContractEvent)
export class ContractEventRepository extends Repository<ContractEvent> {}
