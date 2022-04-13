import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { Contract } from '../contract/contract.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
@Unique(['billingModelId', 'networkId', 'contractAddress'])
export class BillingModel extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  billingModelId: string

  @Column('varchar', { length: 42 })
  contractAddress: string

  @Column('varchar', { length: 42 })
  networkId: string

  @Column('varchar', { length: 255 })
  payee: string

  @Column('varchar', { length: 255 })
  name: string

  @Column('varchar', { length: 255 })
  amount: string

  @Column('varchar', { length: 255 })
  sellingToken: string

  @Column('varchar', { length: 255 })
  settlementToken: string

  @Column('varchar', { length: 255, nullable: true })
  frequency: string

  @Column('varchar', { length: 255, nullable: true })
  numberOfPayments: string

  @OneToMany(
    (type) => BMSubscription,
    (bmSubscription) => bmSubscription.billingModel,
  )
  bmSubscriptions: BMSubscription[]

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
