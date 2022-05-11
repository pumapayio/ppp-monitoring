import { Injectable } from '@nestjs/common'
import { BillingModel } from './billing-model.entity'
import { BillingModelRepository } from './billing-model.repository'
import { CreateBMDto } from './dto/createBM.dto'

@Injectable()
export class BillingModelService {
  constructor(
    private readonly billingModelRepository: BillingModelRepository,
  ) {}

  public async create(
    createBMSubscriptionDto: CreateBMDto,
  ): Promise<BillingModel> {
    const billingModel = new BillingModel()
    Object.assign(billingModel, createBMSubscriptionDto)

    return await this.billingModelRepository.save(billingModel)
  }

  public async retrieveByBlockchainId(
    billingModelId: string,
    contractAddress: string,
    networkId: string,
  ): Promise<BillingModel> {
    return await this.billingModelRepository.findOne({
      where: {
        billingModelId,
        contractAddress,
        networkId,
      },
    })
  }
}
