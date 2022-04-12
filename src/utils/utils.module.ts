import { Module } from '@nestjs/common'
import { SmartContractReader } from 'src/utils/smartContractReader'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Module({
  providers: [SmartContractReader, Web3Helper],
  exports: [SmartContractReader, Web3Helper],
})
export class UtilsModule {}
