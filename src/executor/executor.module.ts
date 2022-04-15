import { Module } from '@nestjs/common'
import { BMSubscriptionModule } from 'src/api/bm-subscription/bm-subscription.module'
import { UtilsModule } from 'src/utils/utils.module'
import { ExecutorService } from './executor.service'

@Module({
  imports: [BMSubscriptionModule, UtilsModule],
  providers: [ExecutorService],
})
export class ExecutorModule {
  constructor(private executorService: ExecutorService) {
    this.executorService.processUpcomingPullPaymentExecutions()
  }
}
