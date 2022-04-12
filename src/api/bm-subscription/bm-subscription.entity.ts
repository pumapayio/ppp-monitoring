import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { PullPayment } from '../pull-payment/pull-payment.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class BMSubscription extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany('PullPayment', 'subscription')
  pullPayments: PullPayment[]

  @Column('varchar', { length: 255 })
  billingModelId: string

  @ManyToOne('BillingModel', 'subscriptions', {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'id',
    referencedColumnName: 'id',
  })
  billingModel: BillingModel

  @Column('varchar', { length: 255 })
  subscriber: string

  @Column('varchar', { length: 255 })
  paymentToken: string

  @Column('varchar', { length: 255 })
  numberOfPayments: string

  @Column('varchar', { length: 255 })
  startTimestamp: string

  @Column('varchar', { length: 255 })
  cancelTimestamp: string

  @Column('varchar', { length: 255 })
  nextPaymentTimestamp: string

  @Column('varchar', { length: 255 })
  lastPaymentTimestamp: string
}
