import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import AppConfig from './app.config'
import BlockchainConfig from './blockchain.config'
import DatabaseConfig from './database.config'
import MailConfig from './mail.config'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
      }`,
      load: [
        () => ({ app: AppConfig() }),
        () => ({ database: DatabaseConfig() }),
        () => ({ blockchain: BlockchainConfig() }),
        () => ({ mail: MailConfig() }),
      ],
    }),
  ],
})
export class ConfigModule {}
