import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateAudit } from '../shared/entity/date-audit.entity'

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

  @Column('integer')
  lastSyncedBlock: number

  @Column('boolean')
  isSyncing: boolean

  @Column('boolean')
  syncHistorical: boolean
}
