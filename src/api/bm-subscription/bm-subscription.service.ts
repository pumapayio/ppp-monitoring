import { Injectable, Logger } from '@nestjs/common'
import { BMSubscription } from './bm-subscription.entity'
import { BMSubscriptionRepository } from './bm-subscription.repository'
import { CreateBMSubscriptionDto } from './dto/createBMSubscription.dto'
import { UpdateBMSubscriptionDto } from './dto/updateBMSubscription.dto'

@Injectable()
export class BMSubscriptionService {
  private readonly logger = new Logger(BMSubscriptionService.name)

  constructor(
    private readonly bmSubscriptionRepository: BMSubscriptionRepository,
  ) {}

  public async create(
    createBMSubscriptionDto: CreateBMSubscriptionDto,
  ): Promise<BMSubscription> {
    const subscription = new BMSubscription()
    Object.assign(subscription, createBMSubscriptionDto)
    console.log(subscription)
    const createBMSubscription = await this.bmSubscriptionRepository.save(
      subscription,
    )

    return createBMSubscription
  }

  public async retrieveById(subscriptionID: string): Promise<BMSubscription> {
    return await this.bmSubscriptionRepository.findOne(subscriptionID)
  }

  public async update(
    _subscription: UpdateBMSubscriptionDto,
  ): Promise<BMSubscription> {
    const subscription = await this.retrieveById(_subscription.subscriptionId)
    if (subscription) {
      Object.assign(subscription, _subscription)
      return await this.bmSubscriptionRepository.save(subscription)
    }
    return null
  }
}
