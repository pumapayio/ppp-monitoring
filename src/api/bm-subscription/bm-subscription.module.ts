import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from '../../mail/mail.module'
import { BMSubscriptionRepository } from './bm-subscription.repository'
import { BMSubscriptionService } from './bm-subscription.service'

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([BMSubscriptionRepository])],
  controllers: [],
  providers: [BMSubscriptionService],
  exports: [BMSubscriptionService],
})
export class BMSubscriptionModule {}
