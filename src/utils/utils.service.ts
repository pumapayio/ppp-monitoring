import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { OperationModes } from './operationModes'
import { ContractEventTypes } from '../api/contract-event/contract-event-types'
import { map } from 'rxjs'
import { BillingModel } from '../api/billiing-model/billing-model.entity'
import { BMSubscription } from '../api/bm-subscription/bm-subscription.entity'
import { PullPayment } from '../api/pull-payment/pull-payment.entity'

@Injectable()
export class UtilsService {
  constructor(
    private config: ConfigService,
    private httpService: HttpService,
  ) {}

  public isExecutorMode(): boolean {
    return (
      OperationModes[this.config.get('app.mode')] === OperationModes.Executor ||
      OperationModes[this.config.get('app.mode')] ===
        OperationModes.MerchantExecutor
    )
  }

  public isMerchantMode(): boolean {
    return (
      OperationModes[this.config.get('app.mode')] ===
        OperationModes.MerchantMonitoring ||
      OperationModes[this.config.get('app.mode')] ===
        OperationModes.MerchantExecutor
    )
  }

  public checkMerchantAPI(): Promise<any> {
    const headers = this.setupHeaders()
    return this.httpService
      .get(`${this.config.get('app.apiURL')}`, {
        headers,
      })
      .toPromise()
  }

  public async notifyMerchant(
    eventType: ContractEventTypes,
    payload: BillingModel | BMSubscription | PullPayment | any,
  ): Promise<any> {
    const notificationMsg = this.constructNotificationBody(eventType, payload)
    const headers = this.setupHeaders()
    console.log('notifying....', eventType, notificationMsg)
    return this.httpService
      .post(this.config.get('app.apiURL'), notificationMsg, {
        headers,
      })
      .toPromise()
  }

  private setupHeaders() {
    const headers = {}
    // TODO: Add any other required header params
    // Maybe we can allow a list of key / values for headers
    headers[`${this.config.get('app.requestHeaderKey')}`] = this.config.get(
      'app.requestHeaderValue',
    )

    return headers
  }

  private constructNotificationBody(
    eventType: ContractEventTypes,
    payload: BillingModel | BMSubscription | PullPayment | any,
  ): any {
    delete payload.createdAt
    delete payload.updatedAt
    delete payload.deletedAt

    delete payload?.billingModel?.createdAt
    delete payload?.billingModel?.updatedAt
    delete payload?.billingModel?.deletedAt

    delete payload?.bmSubscription?.createdAt
    delete payload?.bmSubscription?.updatedAt
    delete payload?.bmSubscription?.deletedAt
    delete payload?.bmSubscription?.billingModel?.createdAt
    delete payload?.bmSubscription?.billingModel?.updatedAt
    delete payload?.bmSubscription?.billingModel?.deletedAt

    return {
      eventType: eventType,
      payload,
    }
  }
}
