import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { Contract } from '../contract/contract.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
@Unique(['billingModelId', 'networkId', 'contractAddress'])
export class BillingModel extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index()
  @Column('varchar', { length: 255 })
  billingModelId: string

  @Index()
  @Column('varchar', { length: 42 })
  contractAddress: string

  @Index()
  @Column('varchar', { length: 42 })
  networkId: string

  @Column('varchar', { length: 255 })
  payee: string

  @Column('varchar', { length: 255, default: 0 })
  blockCreationTime: string

  @Column('varchar', { length: 255, nullable: true })
  name: string

  @Column('varchar', { length: 255, nullable: true })
  amount: string

  @Column('varchar', { length: 255, nullable: true })
  merchantName: string

  @Column('varchar', { length: 255, nullable: true })
  merchantURL: string

  @Index()
  @Column('varchar', { length: 255, nullable: false })
  uniqueReference: string

  @Column('varchar', { length: 255, nullable: true })
  sellingToken: string

  @Column('varchar', { length: 255, nullable: true })
  settlementToken: string

  @Column('varchar', { length: 255, nullable: true })
  frequency: string

  @Column('varchar', { length: 255, nullable: true })
  numberOfPayments: string

  @Column('varchar', { length: 255, nullable: true })
  trialPeriod: string

  @Column('varchar', { length: 255, nullable: true })
  initialAmount: string

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
