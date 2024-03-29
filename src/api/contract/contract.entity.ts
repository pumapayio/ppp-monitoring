import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Unique,
  Index,
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

  @Index()
  @Column('varchar')
  networkId: string

  @Column('varchar')
  abi: string

  @OneToMany(() => BillingModel, (billingModel) => billingModel.contract)
  billingModels: BillingModel[]

  @OneToMany(() => ContractEvent, (contractEvent) => contractEvent.contract)
  contractEvents: ContractEvent[]
}
