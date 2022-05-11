import { Injectable } from '@nestjs/common'
import { OperationModes } from './operationModes'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UtilsService {
  constructor(private config: ConfigService) {}

  public isExecutorMode(): boolean {
    return (
      OperationModes[this.config.get('app.mode')] === OperationModes.Executor ||
      OperationModes[this.config.get('app.mode')] ===
        OperationModes.MerchantExecutor
    )
  }
}
