import { Injectable, Logger } from '@nestjs/common'
import { CreatePullPaymentDto } from './dto/create-pull-payment.dto'
import { PullPayment } from './pull-payment.entity'
import { PullPaymentRepository } from './pull-payment.repository'

@Injectable()
export class PullPaymentService {
  private readonly logger = new Logger(PullPaymentService.name)

  constructor(private readonly pullPaymentRepository: PullPaymentRepository) {}

  public async create(
    createBMSubscriptionDto: CreatePullPaymentDto,
  ): Promise<PullPayment> {
    const pullPayment = new PullPayment()
    Object.assign(pullPayment, createBMSubscriptionDto)

    const createPullPayment = await this.pullPaymentRepository.save(pullPayment)

    return createPullPayment
  }

  public async retrieveById(pullPaymentID: string): Promise<PullPayment> {
    return await this.pullPaymentRepository.findOne(pullPaymentID)
  }

  public async retrieveByBlockchainId(
    billingModelId: string,
    bmSubscriptionId: string,
    pullPaymentId: string,
    contractAddress: string,
    networkId: string,
  ): Promise<PullPayment> {
    return await this.pullPaymentRepository.findOne({
      where: {
        billingModelId,
        bmSubscriptionId,
        pullPaymentId,
        contractAddress,
        networkId,
      },
    })
  }
}
