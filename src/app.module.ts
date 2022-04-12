import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DatabaseModule } from './database/database.module'
import { ApiModule } from './api/api.module'
import { MonitoringModule } from './monitoring/monitoring.module'

@Module({
  imports: [ConfigModule, DatabaseModule, ApiModule, MonitoringModule],
})
export class AppModule {}
