import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BillingModelRepository } from './billing-model.repository'
import { BillingModelService } from './billing-model.service'

@Module({
  imports: [TypeOrmModule.forFeature([BillingModelRepository])],
  controllers: [],
  providers: [BillingModelService],
  exports: [BillingModelService],
})
export class BillingModelModule {}
