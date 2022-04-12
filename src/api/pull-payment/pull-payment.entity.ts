import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class PullPayment extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  bmSubscriptionId: string

  @Column('varchar', { length: 255 })
  paymentAmount: string

  @Column('varchar', { length: 255 })
  executionTimestamp: string

  @ManyToOne((type) => BMSubscription, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({
    name: 'bmSubscriptionId',
    referencedColumnName: 'bmSubscriptionId',
  })
  bmSubscription: BMSubscription
}
