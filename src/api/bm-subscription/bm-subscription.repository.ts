import { now } from 'moment'
import {
  EntityRepository,
  Equal,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { BMSubscription } from './bm-subscription.entity'

@EntityRepository(BMSubscription)
export class BMSubscriptionRepository extends Repository<BMSubscription> {
  public async findAllToBeExecuted(
    networkId: string,
  ): Promise<BMSubscription[]> {
    const startTimestamp = Math.floor(now() / 1000) // convert milliseconds to second
    const bmSubscriptions = await this.find({
      relations: ['billingModel', 'billingModel.contract'],
      where: {
        nextPaymentTimestamp: LessThanOrEqual(startTimestamp),
        cancelTimestamp: Equal(0),
        numberOfPayments: MoreThan(0),
        networkId,
      },
      order: {
        nextPaymentTimestamp: 'ASC',
      },
    })

    return bmSubscriptions
  }

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
