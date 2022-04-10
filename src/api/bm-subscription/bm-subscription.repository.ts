import { EntityRepository, Repository } from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { BMSubscription } from './bm-subscription.entity'

@EntityRepository(BMSubscription)
export class BMSubscriptionRepository extends Repository<BMSubscription> {
  public async findAllForBillingModel(
    billingModel: BillingModel,
  ): Promise<BMSubscription[]> {
    const bmSubscriptions = await this.find({
      where: {
        billingModel,
      },
      order: {
        createdAt: 'ASC',
      },
    })

    return bmSubscriptions
  }
}
