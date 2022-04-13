import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
@Unique([
  'billingModelId',
  'bmSubscriptionId',
  'pullPaymentId',
  'networkId',
  'contractAddress',
])
export class PullPayment extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  billingModelId: string

  @Column('varchar', { length: 255 })
  bmSubscriptionId: string

  @Column('varchar', { length: 255 })
  pullPaymentId: string

  @Column('varchar', { length: 42 })
  contractAddress: string

  @Column('varchar', { length: 42 })
  networkId: string

  @Column('varchar', { length: 255 })
  paymentAmount: string

  @Column('varchar', { length: 255 })
  executionTimestamp: string

  @ManyToOne((type) => BMSubscription, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([
    { name: 'billingModelId', referencedColumnName: 'billingModelId' },
    {
      name: 'bmSubscriptionId',
      referencedColumnName: 'bmSubscriptionId',
    },
    {
      name: 'networkId',
      referencedColumnName: 'networkId',
    },
    {
      name: 'contractAddress',
      referencedColumnName: 'contractAddress',
    },
  ])
  bmSubscription: BMSubscription
}
