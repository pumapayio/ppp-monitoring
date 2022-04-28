import { Logger, Module } from '@nestjs/common'
import { BMSubscriptionModule } from 'src/api/bm-subscription/bm-subscription.module'
import { UtilsModule } from 'src/utils/utils.module'
import { ExecutorService } from './executor.service'
import { ConfigService } from '@nestjs/config'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

@Module({
  imports: [BMSubscriptionModule, UtilsModule],
  providers: [ExecutorService],
})
export class ExecutorModule {
  private readonly logger = new Logger(ExecutorModule.name)

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private config: ConfigService,
    private executorService: ExecutorService,
  ) {
    JSON.parse(this.config.get('blockchain.supportedNetworks')).map(
      (networkId) => {
        this.executorService.processUpcomingPullPaymentExecutions(
          String(networkId),
        )
        const cronInterval =
          process.env.SCHEDULER_CRON_EXPRESSION ||
          CronExpression.EVERY_5_MINUTES
        const cronJobName = `UpcomingPullPayments_${networkId}`
        const job = new CronJob(cronInterval, () => {
          this.logger.debug(
            `Name: ${cronJobName} - Cron Interval: ${cronInterval}`,
          )
          this.executorService.processUpcomingPullPaymentExecutions(
            String(networkId),
          )
        })
        this.schedulerRegistry.addCronJob(cronJobName, job)
        job.start()

        this.logger.debug(`Cron Job ${cronJobName} added`)
      },
    )
  }
}
