import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
} from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { ContractEvent } from '../contract-event/contract-event.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
@Unique(['address', 'networkId'])
export class Contract extends DateAudit {
  @PrimaryGeneratedColumn('rowid')
  id: string

  @Column('varchar', { length: 255 })
  contractName: string

  @Column('varchar', { length: 42 })
  address: string

  @Column('varchar')
  networkId: string

  @Column('varchar')
  abi: string

  @OneToMany((type) => BillingModel, (billingModel) => billingModel.contract)
  billingModels: BillingModel[]

  @OneToMany((type) => ContractEvent, (contractEvent) => contractEvent.contract)
  contractEvents: ContractEvent[]
}
