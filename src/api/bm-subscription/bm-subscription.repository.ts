import { now } from 'moment'
import {
  EntityRepository,
  Equal,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm'
import { BMSubscription } from './bm-subscription.entity'

@EntityRepository(BMSubscription)
export class BMSubscriptionRepository extends Repository<BMSubscription> {
  public async findAllToBeExecuted(
    networkId: string,
  ): Promise<BMSubscription[]> {
    const startTimestamp = Math.floor(now() / 1000) // convert milliseconds to second

    return await this.find({
      relations: ['billingModel', 'billingModel.contract'],
      where: {
        nextPaymentTimestamp: LessThanOrEqual(startTimestamp),
        cancelTimestamp: Equal(0),
        remainingNumberOfPayments: MoreThan(0),
        networkId,
      },
      order: {
        nextPaymentTimestamp: 'ASC',
      },
    })
  }
}
