import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'
// import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class BillingModel extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255 })
  billingModelId: string

  // @OneToMany('Subscription', 'billingModel')
  // subscriptions: BMSubscription[]

  @Column('varchar', { length: 255 })
  payee: string

  @Column('varchar', { length: 255 })
  name: string

  @Column('varchar', { length: 255 })
  amount: string

  @Column('varchar', { length: 255 })
  token: string

  @Column('varchar', { length: 255, nullable: true })
  frequency: string

  @Column('varchar', { length: 255, nullable: true })
  numberOfPayments: string
}
