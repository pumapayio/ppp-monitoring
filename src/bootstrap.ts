import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as compression from 'compression'
import * as rateLimit from 'express-rate-limit'
import * as helmet from 'helmet'
import * as nocache from 'nocache'
import { resolve } from 'path'

import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { OperationModes } from './utils/operationModes'
import { LogLevel } from '@nestjs/common/services/logger.service'

export async function bootstrap() {
  /*
  |--------------------------------------------------------------------------
  | Creates an instance of the NestApplication
  |--------------------------------------------------------------------------
  |
  | Nest application context. Nest context is a wrapper around the Nest
  | container, which holds all instantiated classes. We can grab an existing
  | instance from within any imported module directly using application object.
  | Hence, you can take advantage of the Nest framework everywhere, including
  | CRON jobs and even build a CLI on top of it.
  |
  */

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.LOG_LEVELS && JSON.parse(process.env.LOG_LEVELS).length > 0
        ? (JSON.parse(process.env.LOG_LEVELS) as LogLevel[])
        : ['log', 'error', 'warn', 'debug', 'verbose'],
  })
  const config = app.get(ConfigService)

  /*
  |--------------------------------------------------------------------------
  | Check that the configuration is correct based on the operation mode
  |--------------------------------------------------------------------------
  |
  */
  switch (config.get('app.operationMode')) {
    case OperationModes.Executor: {
      if (config.get('blockchain.executorKey') === null) {
        throw Error(
          `=============================================
          Executor service not configured correctly!
          Make sure you have set EXECUTOR_PRIVATE_KEY
          =============================================`,
        )
      }
      break
    }
    case OperationModes.MerchantMonitoring:
      {
        if (JSON.parse(config.get('app.monitoringAddresses')).length === 0) {
          throw Error(
            `=============================================
          Merchant Monitoring service not configured correctly!
          Make sure you have set MONITORING_ADDRESSES
          =============================================`,
          )
        }
      }
      break
    case OperationModes.MerchantNotification: {
      if (
        JSON.parse(config.get('app.monitoringAddresses')).length === 0 ||
        config.get('app.apiURL') === null ||
        config.get('app.requestHeaderKey') === null ||
        config.get('app.requestHeaderValue') === null
      ) {
        throw Error(
          `=============================================
          Merchant Notification service not configured correctly!
          Make sure you have set MONITORING_ADDRESSES, API_URL,
          REQUEST_HEADER_KEY and REQUEST_HEADER_VALUE
          =============================================`,
        )
      }
      break
    }
  }
  /*
  |--------------------------------------------------------------------------
  | Add Global Express Middlewares
  |--------------------------------------------------------------------------
  |
  | Here we can add some global express middlewares. This will affect the
  | whole application.
  |
  */

  app.enableCors()
  app.use(helmet())
  app.use(nocache())
  app.use(compression())
  app.use(
    (rateLimit as any)({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  )

  app.useGlobalPipes(new ValidationPipe())
  app.useStaticAssets(resolve(__dirname, '..', 'resources'))

  /*
  |--------------------------------------------------------------------------
  | Swagger
  |--------------------------------------------------------------------------
  |
  | Swagger is a Open-Source framework to design and document your api.
  | The added tags define our RESTful resource endpoints.
  |
  */

  const options = new DocumentBuilder()
    .setTitle(config.get('app.title'))
    .setDescription(config.get('app.description'))
    .setVersion(config.get('app.version'))
    .addServer(config.get('app.appUrl'))
    .addTag('API Information', 'Basic information about this API')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('docs', app, document)

  /*
  |--------------------------------------------------------------------------
  | Run The Application
  |--------------------------------------------------------------------------
  |
  | Once we have our application, we can listen for incoming request and send
  | the associated response.
  |
  */

  const logger = new Logger('Bootstrap')

  await app.listen(config.get('app.port'), () => {
    logger.log(`Server is listen on http://localhost:${config.get('app.port')}`)
    logger.log(`=== OPERATION MODE - ${config.get('app.operationMode')} ===`)
    if (
      config.get('app.operationMode') === OperationModes.MerchantMonitoring ||
      config.get('app.operationMode') === OperationModes.MerchantNotification
    ) {
      logger.log(
        `=== MONITORING ADDRESSES - ${JSON.parse(
          config.get('app.monitoringAddresses'),
        )} ===`,
      )
    }
  })
}
