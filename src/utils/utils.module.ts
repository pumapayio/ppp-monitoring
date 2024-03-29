import { Module } from '@nestjs/common'
import { SmartContractReader } from 'src/utils/smartContractReader'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { UtilsService } from './utils.service'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  providers: [SmartContractReader, Web3Helper, UtilsService],
  exports: [SmartContractReader, Web3Helper, UtilsService],
})
export class UtilsModule {}
