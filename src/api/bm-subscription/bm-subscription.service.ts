import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BMSubscription } from './bm-subscription.entity'
import { BMSubscriptionRepository } from './bm-subscription.repository'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'
import { UpdateBMSubscriptionDto } from './dto/updateBMSubscription.dto'

@Injectable()
export class BMSubscriptionService {
  private readonly logger = new Logger(BMSubscriptionService.name)

  constructor(
    private readonly config: ConfigService,
    private readonly bmSubscriptionRepository: BMSubscriptionRepository,
  ) {}

  public async create(
    createBMSubscriptionDto: CreateBMSubscriptionDto,
  ): Promise<BMSubscription> {
    const subscription = new BMSubscription()
    Object.assign(subscription, createBMSubscriptionDto)
    const createBMSubscription = await this.bmSubscriptionRepository.save(
      subscription,
    )

    return createBMSubscription
  }

  public async retrieveById(subscriptionID: string): Promise<BMSubscription> {
    return await this.bmSubscriptionRepository.findOne(subscriptionID)
  }

  public async retrieveBySubscriptionId(
    bmSubscriptionId: string,
    billingModelId: string,
    networkId: string,
    contractAddress: string,
  ): Promise<BMSubscription> {
    return await this.bmSubscriptionRepository.findOne({
      where: { bmSubscriptionId, billingModelId, networkId, contractAddress },
    })
  }

  public async retrieveUpcomingSubscriptions(): Promise<BMSubscription[]> {
    return await this.bmSubscriptionRepository.findAllToBeExecuted()
  }

  public async update(
    _subscription: UpdateBMSubscriptionDto,
    networkId: string,
    contractAddress: string,
  ): Promise<BMSubscription> {
    const subscription = await this.retrieveBySubscriptionId(
      _subscription.bmSubscriptionId,
      _subscription.billingModelId,
      networkId,
      contractAddress,
    )
    if (subscription) {
      Object.assign(subscription, _subscription)
      console.log(subscription)
      return await this.bmSubscriptionRepository.save(subscription)
    }
    return null
  }
}
