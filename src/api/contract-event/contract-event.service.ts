import { Injectable, Logger } from '@nestjs/common'
import { ContractEventTypes } from './contract-event-types'
import { ContractEvent } from './contract-event.entity'
import { ContractEventRepository } from './contract-event.repository'
import { UpdateContractEventDto } from './dto/updateContractEvent.dto'

@Injectable()
export class ContractEventService {
  private readonly logger = new Logger(ContractEventService.name)

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
    eventType: ContractEventTypes,
    networkId: number,
  ): Promise<ContractEvent[]> {
    const contractEvents = await this.contractEventRepository.find({
      where: {
        networkId,
        eventName: eventType,
      },
      order: {
        createdAt: 'ASC',
      },
    })

    return contractEvents
  }
}
