import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BMSubscription } from '../bm-subscription/bm-subscription.entity'
import { DateAudit } from '../shared/entity/date-audit.entity'

@Entity()
export class BillingModel extends DateAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { length: 255, unique: true })
  billingModelId: string

  @OneToMany(
    (type) => BMSubscription,
    (bmSubscription) => bmSubscription.billingModel,
  )
  bmSubscriptions: BMSubscription[]

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
}
