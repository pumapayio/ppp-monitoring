import { EntityRepository, Repository } from 'typeorm'
import { PullPayment } from './pull-payment.entity'

@EntityRepository(PullPayment)
export class PullPaymentRepository extends Repository<PullPayment> {}
