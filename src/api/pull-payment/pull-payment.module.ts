import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MailModule } from '../../mail/mail.module'
import { PullPaymentRepository } from './pull-payment.repository'
import { PullPaymentService } from './pull-payment.service'

@Module({
  imports: [MailModule, TypeOrmModule.forFeature([PullPaymentRepository])],
  controllers: [],
  providers: [PullPaymentService],
  exports: [PullPaymentService],
})
export class PullPaymentModule {}
