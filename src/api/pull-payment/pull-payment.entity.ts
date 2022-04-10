import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class PullPayment extends DateAudit {
  @PrimaryColumn('varchar', { length: 255 })
  pullPaymentID: string

  @Column('varchar', { length: 255 })
  subscriptionID: string

  // @ManyToOne('Subscription', 'pullPayments', {
  //   onDelete: 'CASCADE',
  //   nullable: false,
  // })
  // @JoinColumn({
  //   name: 'subscriptionID',
  //   referencedColumnName: 'subscriptionID',
  // })
  // subscription: BMSubscription

  @Column('varchar', { length: 255 })
  paymentAmount: string

  @Column('varchar', { length: 255 })
  executionTimestamp: string
}
