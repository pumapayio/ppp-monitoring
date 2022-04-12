import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class PullPayment extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

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
