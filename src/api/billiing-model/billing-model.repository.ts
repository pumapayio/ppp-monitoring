import { EntityRepository, Repository } from 'typeorm'
import { BillingModel } from './billing-model.entity'

@EntityRepository(BillingModel)
export class BillingModelRepository extends Repository<BillingModel> {
  public async findAllForBillingModel(
    billingModel: BillingModel,
  ): Promise<BillingModel[]> {
    const billingModels = await this.find({
      where: {
        billingModel,
      },
      order: {
        createdAt: 'ASC',
      },
    })

    return billingModels
  }
}
