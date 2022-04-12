import { Injectable } from '@nestjs/common'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { SmartContractNames } from 'src/utils/blockchain'
import { SinglePullPaymentBMCreatedEventMonitoring } from './event-monitoring/single-pull-payment/bm-created-event.service'
import { SinglePullPaymentBMEditedEventMonitoring } from './event-monitoring/single-pull-payment/bm-edited-event.service'
import { SinglePullPaymentPPExectutedEventMonitoring } from './event-monitoring/single-pull-payment/pp-executed-event.service'

@Injectable()
export class MonitoringService {
  constructor(
    private contractEventService: ContractEventService,
    private singlePullPaymentBMCreatedEventService: SinglePullPaymentBMCreatedEventMonitoring,
    private singlePullPaymentBMEditedEventService: SinglePullPaymentBMEditedEventMonitoring,
    private singlePullPaymentPPExectutedEventMonitoring: SinglePullPaymentPPExectutedEventMonitoring,
  ) {}

  public monitorEvents(networkId: number) {
    this.monitorBMCreationEvents(networkId)
    this.monitorNewSubscriptionEvents(networkId)
    this.monitorPullPaymentExecutionEvents(networkId)
    this.monitorBMUpdatedEvents(networkId)
  }

  private async monitorBMCreationEvents(networkId: number) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.BillingModelCreated,
      networkId,
    )
    for (let event of events) {
      switch (event.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentBMCreatedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
      }
    }
  }

  private async monitorNewSubscriptionEvents(networkId: number) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.NewSubscription,
      networkId,
    )
  }

  private async monitorPullPaymentExecutionEvents(networkId: number) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.PullPaymentExecuted,
      networkId,
    )

    for (let event of events) {
      switch (event.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentPPExectutedEventMonitoring.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
      }
    }
  }

  private async monitorBMUpdatedEvents(networkId: number) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.BillingModelEdited,
      networkId,
    )

    for (let event of events) {
      switch (event.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentBMEditedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contractName)
          break
        }
      }
    }
  }
}
