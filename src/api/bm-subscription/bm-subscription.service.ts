import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BMSubscription } from './bm-subscription.entity'
import { BMSubscriptionRepository } from './bm-subscription.repository'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'

@Injectable()
export class BMSubscriptionService {
  constructor(
    private readonly config: ConfigService,
    private readonly bmSubscriptionRepository: BMSubscriptionRepository,
  ) {}

  public async create(
    createBMSubscriptionDto: CreateBMSubscriptionDto,
  ): Promise<BMSubscription> {
    const subscription = new BMSubscription()
    Object.assign(subscription, createBMSubscriptionDto)

    return await this.bmSubscriptionRepository.save(subscription)
  }

  public async retrieveUpcomingSubscriptions(
    networkId: string,
  ): Promise<BMSubscription[]> {
    return await this.bmSubscriptionRepository.findAllToBeExecuted(networkId)
  }

  public async retrieveByBlockchainId(
    billingModelId: string,
    bmSubscriptionId: string,
    contractAddress: string,
    networkId: string,
  ): Promise<BMSubscription> {
    return await this.bmSubscriptionRepository.findOne({
      where: {
        billingModelId,
        bmSubscriptionId,
        contractAddress,
        networkId,
      },
    })
  }
}
