import { now } from 'moment'
import { EntityRepository, LessThanOrEqual, Repository } from 'typeorm'
import { BillingModel } from '../billiing-model/billing-model.entity'
import { BMSubscription } from './bm-subscription.entity'

@EntityRepository(BMSubscription)
export class BMSubscriptionRepository extends Repository<BMSubscription> {
  public async findAllToBeExecuted(): Promise<BMSubscription[]> {
    const startTimestamp = Math.floor(now() / 1000) // convert miliseconds to second
    const bmSubscriptions = await this.find({
      relations: ['billingModel', 'billingModel.contract'],
      where: {
        nextPaymentTimestamp: LessThanOrEqual(startTimestamp),
        numberOfPayments: GreaterThan(0),
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
function GreaterThan(
  arg0: number,
): any | string | import('typeorm').FindOperator<string> {
  throw new Error('Function not implemented.')
}
