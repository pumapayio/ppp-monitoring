import { Injectable } from '@nestjs/common'
import { ContractEventTypes } from './contract-event-types'
import { ContractEvent } from './contract-event.entity'
import { ContractEventRepository } from './contract-event.repository'
import { UpdateContractEventDto } from './dto/updateContractEvent.dto'

@Injectable()
export class ContractEventService {
  constructor(
    private readonly contractEventRepository: ContractEventRepository,
  ) {}

  public async update(
    _contractEvent: UpdateContractEventDto,
  ): Promise<ContractEvent> {
    const contractEvent = await this.retrieveById(_contractEvent.id)
    if (contractEvent) {
      Object.assign(contractEvent, _contractEvent)
      return await this.contractEventRepository.save(contractEvent)
    }
    return null
  }

  public async retrieveById(contractEventId: string): Promise<ContractEvent> {
    return await this.contractEventRepository.findOne(contractEventId)
  }

  public async retrieveContractEventByType(
    eventName: ContractEventTypes,
    networkId: string,
  ): Promise<ContractEvent[]> {
    return await this.contractEventRepository.find({
      where: {
        networkId,
        eventName,
      },
      relations: ['contract'],
      order: {
        createdAt: 'ASC',
      },
    })
  }
}
