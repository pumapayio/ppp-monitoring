import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { PullPayment } from '../pull-payment/pull-payment.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
@Unique(['billingModelId', 'bmSubscriptionId', 'networkId', 'contractAddress'])
export class BMSubscription extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255, unique: true })
  bmSubscriptionId: string

  @Column('varchar', { length: 255 })
  billingModelId: string

  @Column('varchar', { length: 42 })
  contractAddress: string

  @Column('varchar', { length: 42 })
  networkId: string

  @Column('varchar', { length: 255 })
  subscriber: string

  @Column('varchar', { length: 255 })
  paymentToken: string

  @Column('varchar', { length: 255, nullable: true })
  numberOfPayments: string

  @Column('varchar', { length: 255, nullable: true })
  startTimestamp: string

  @Column('varchar', { length: 255, nullable: true })
  cancelTimestamp: string

  @Column('varchar', { length: 255, nullable: true })
  nextPaymentTimestamp: string

  @Column('varchar', { length: 255, nullable: true })
  lastPaymentTimestamp: string

  @ManyToOne((type) => BillingModel, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn([
    {
      name: 'billingModelId',
      referencedColumnName: 'billingModelId',
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
  billingModel: BillingModel

  @OneToMany((type) => PullPayment, (pullPayment) => pullPayment.bmSubscription)
  pullPayments: PullPayment[]
}
