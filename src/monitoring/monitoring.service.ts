import { Injectable } from '@nestjs/common'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { SmartContractNames } from 'src/utils/blockchain'
import { SinglePullPaymentBMCreatedEventMonitoring } from './event-monitoring/single-pull-payment/bm-created-event.service'
import { SinglePullPaymentBMEditedEventMonitoring } from './event-monitoring/single-pull-payment/bm-edited-event.service'
import { SingleBMSubscriptionEventMonitoring } from './event-monitoring/single-pull-payment/bm-subscription-event.service'
import { SinglePPExectutionEventMonitoring } from './event-monitoring/single-pull-payment/pp-executed-event.service'

@Injectable()
export class MonitoringService {
  constructor(
    private contractEventService: ContractEventService,
    private singlePullPaymentBMCreatedEventService: SinglePullPaymentBMCreatedEventMonitoring,
    private singlePullPaymentBMEditedEventService: SinglePullPaymentBMEditedEventMonitoring,
    private singlePullPaymentPPExectutedEventMonitoring: SingleBMSubscriptionEventMonitoring,
    private singlePPExectutionEventMxonitoring: SinglePPExectutionEventMonitoring,
  ) {}

  public monitorEvents(networkId: string) {
    this.monitorBMCreationEvents(networkId)
    this.monitorNewSubscriptionEvents(networkId)
    this.monitorPullPaymentExecutionEvents(networkId)
    this.monitorBMUpdatedEvents(networkId)
  }

  private async monitorBMCreationEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.BillingModelCreated,
      networkId,
    )
    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentBMCreatedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
      }
    }
  }

  private async monitorNewSubscriptionEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.NewSubscription,
      networkId,
    )

    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentPPExectutedEventMonitoring.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
      }
    }
  }

  private async monitorPullPaymentExecutionEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.PullPaymentExecuted,
      networkId,
    )

    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePPExectutionEventMxonitoring.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
      }
    }
  }

  private async monitorBMUpdatedEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.BillingModelEdited,
      networkId,
    )

    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.singlePP): {
          this.singlePullPaymentBMEditedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringPPPaidTrial): {
          // console.log(event.contract.contractName)
          break
        }
        case String(SmartContractNames.recurringDynamicPP): {
          // console.log(event.contract.contractName)
          break
        }
      }
    }
  }
}
