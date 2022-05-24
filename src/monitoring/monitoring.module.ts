import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContractEventModule } from 'src/api/contract-event/contract-event.module'
import { UtilsModule } from 'src/utils/utils.module'
import { EventMonitoringModule } from './event-monitoring/event-monitoring.module'
import { MonitoringService } from './monitoring.service'
import { UtilsService } from '../utils/utils.service'

@Module({
  imports: [EventMonitoringModule, ContractEventModule, UtilsModule],
  providers: [MonitoringService],
})
export class MonitoringModule {
  constructor(
    private config: ConfigService,
    private utils: UtilsService,
    private monitoringService: MonitoringService,
  ) {
    JSON.parse(this.config.get('blockchain.supportedNetworks')).map(
      (networkId) => {
        let monitorAddresses = []
        if (utils.isMerchantMode()) {
          monitorAddresses = JSON.parse(config.get('app.monitoringAddresses'))
        }
        this.monitoringService.monitorEvents(
          String(networkId),
          monitorAddresses,
        )
      },
    )
  }
}
