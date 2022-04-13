import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
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

  @Column('varchar', { length: 255 })
  contractName: string

  @Column('varchar', { length: 42 })
  address: string

  @Column('varchar')
  abi: string

  @Column('varchar')
  networkId: number

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
}
