import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PullPaymentRepository } from './pull-payment.repository'
import { PullPaymentService } from './pull-payment.service'

@Module({
  imports: [TypeOrmModule.forFeature([PullPaymentRepository])],
  controllers: [],
  providers: [PullPaymentService],
  exports: [PullPaymentService],
})
export class PullPaymentModule {}
