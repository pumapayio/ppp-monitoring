import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { ApiModule } from './api/api.module'
import { MonitoringModule } from './monitoring/monitoring.module'
import { ExecutorModule } from './executor/executor.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    ApiModule,
    MonitoringModule,
    ExecutorModule,
  ],
})
export class AppModule {}
