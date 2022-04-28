import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BMSubscriptionRepository } from './bm-subscription.repository'
import { BMSubscriptionService } from './bm-subscription.service'

@Module({
  imports: [TypeOrmModule.forFeature([BMSubscriptionRepository])],
  controllers: [],
  providers: [BMSubscriptionService],
  exports: [BMSubscriptionService],
})
export class BMSubscriptionModule {}
