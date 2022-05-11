import { EntityRepository, Repository } from 'typeorm'
import { BillingModel } from './billing-model.entity'

@EntityRepository(BillingModel)
export class BillingModelRepository extends Repository<BillingModel> {}
