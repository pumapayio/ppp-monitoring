import { EntityRepository, Repository } from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { PullPayment } from './pull-payment.entity'

@EntityRepository(PullPayment)
export class PullPaymentRepository extends Repository<PullPayment> {
  public async findAllForBillingModel(
    billingModel: BillingModel,
  ): Promise<PullPayment[]> {
    const pullPayments = await this.find({
      where: {
        billingModel,
      },
      order: {
        createdAt: 'ASC',
      },
    })

    return pullPayments
  }
}
