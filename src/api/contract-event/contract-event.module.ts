import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContractEvent } from './contract-event.entity'
import { ContractEventRepository } from './contract-event.repository'
import { ContractEventService } from './contract-event.service'

@Module({
  imports: [TypeOrmModule.forFeature([ContractEventRepository])],
  controllers: [],
  providers: [ContractEventService, ContractEvent],
  exports: [ContractEventService, ContractEvent],
})
export class ContractEventModule {}
