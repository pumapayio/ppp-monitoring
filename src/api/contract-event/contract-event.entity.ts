import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm'
import { Contract } from '../contract/contract.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'
import { ContractEventSyncStatus } from './contract-event-status'

@Entity()
export class ContractEvent extends DateAudit {
  @PrimaryGeneratedColumn('rowid')
  id: string

  @Column('varchar', { length: 255 })
  eventName: string

  @Column('varchar', { length: 255 })
  topic: string

  @Column({
    type: 'enum',
    enum: ContractEventSyncStatus,
    default: ContractEventSyncStatus.Unprocessed,
  })
  syncStatus: ContractEventSyncStatus

  @Column('boolean')
  syncHistorical: boolean

  @Column('integer')
  lastSyncedBlock: number

  @Column('varchar', { default: null, length: 66 })
  lastSyncedTxHash: string

  @Column('varchar', { length: 42 })
  contractAddress: string

  @Index()
  @Column('varchar')
  networkId: string

  @ManyToOne((type) => Contract, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([
    {
      name: 'contractAddress',
      referencedColumnName: 'address',
    },
    {
      name: 'networkId',
      referencedColumnName: 'networkId',
    },
  ])
  contract: Contract
}
