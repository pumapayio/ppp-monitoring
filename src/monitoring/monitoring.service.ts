import { Injectable, Logger } from '@nestjs/common'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { SmartContractNames } from 'src/utils/blockchain'
import { RecurringPullPaymentBMCreatedEventMonitoring } from './event-monitoring/recurring-pull-payment/bm-created-event.service'
import { RecurringPullPaymentBMEditedEventMonitoring } from './event-monitoring/recurring-pull-payment/bm-edited-event.service'
import { RecurringBMSubscriptionEventMonitoring } from './event-monitoring/recurring-pull-payment/bm-subscription-event.service'
import { RecurringPPExecutionEventMonitoring } from './event-monitoring/recurring-pull-payment/pp-executed-event.service'
import { SinglePullPaymentBMCreatedEventMonitoring } from './event-monitoring/single-pull-payment/bm-created-event.service'
import { SinglePullPaymentBMEditedEventMonitoring } from './event-monitoring/single-pull-payment/bm-edited-event.service'
import { SingleBMSubscriptionEventMonitoring } from './event-monitoring/single-pull-payment/bm-subscription-event.service'
import { SubscriptionCancelledEventMonitoring } from './event-monitoring/recurring-pull-payment/subscription-cancelled-event.service'

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name)

  constructor(
    private contractEventService: ContractEventService,
    // Single BM
    private singlePullPaymentBMCreatedEventService: SinglePullPaymentBMCreatedEventMonitoring,
    private singlePullPaymentBMEditedEventService: SinglePullPaymentBMEditedEventMonitoring,
    private singleBMSubscriptionEventMonitoring: SingleBMSubscriptionEventMonitoring,
    // Recurring BM
    private recurringPullPaymentBMCreatedEventMonitoring: RecurringPullPaymentBMCreatedEventMonitoring,
    private recurringPullPaymentBMEditedEventMonitoring: RecurringPullPaymentBMEditedEventMonitoring,
    private recurringBMSubscriptionEventMonitoring: RecurringBMSubscriptionEventMonitoring,
    private recurringPPExecutionEventMonitoring: RecurringPPExecutionEventMonitoring,
    private bmSubscriptionCancelledEventMonitoring: SubscriptionCancelledEventMonitoring,
  ) {}

  public async monitorEvents(networkId: string) {
    await this.monitorBMCreationEvents(networkId)
    await this.monitorNewSubscriptionEvents(networkId)
    await this.monitorPullPaymentExecutionEvents(networkId)
    await this.monitorBMUpdatedEvents(networkId)
    await this.monitorSubscriptionCancelledEvents(networkId)
  }

  private async monitorBMCreationEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.BillingModelCreated,
      networkId,
    )
    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.singleDynamicPP):
        case String(SmartContractNames.singlePP): {
          await this.singlePullPaymentBMCreatedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial):
        case String(SmartContractNames.recurringPPPaidTrial):
        case String(SmartContractNames.recurringDynamicPP):
        case String(SmartContractNames.recurringPP): {
          await this.recurringPullPaymentBMCreatedEventMonitoring.monitor(event)
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
        case String(SmartContractNames.recurringPPFreeTrial):
        case String(SmartContractNames.recurringPPPaidTrial):
        case String(SmartContractNames.recurringDynamicPP):
        case String(SmartContractNames.recurringPP): {
          await this.recurringBMSubscriptionEventMonitoring.monitor(event)
          break
        }
        case String(SmartContractNames.singleDynamicPP):
        case String(SmartContractNames.singlePP): {
          await this.singleBMSubscriptionEventMonitoring.monitor(event)
          break
        }
        default: {
          this.logger.warn(
            `Contract ${event.contract.contractName} that cannot be processed!`,
          )
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
        case String(SmartContractNames.recurringPPFreeTrial):
        case String(SmartContractNames.recurringPPPaidTrial):
        case String(SmartContractNames.recurringDynamicPP):
        case String(SmartContractNames.recurringPP): {
          await this.recurringPPExecutionEventMonitoring.monitor(event)
          break
        }
        default:
        case String(SmartContractNames.singleDynamicPP):
        case String(SmartContractNames.singlePP): {
          this.logger.debug(
            `Nothing to monitor for ${event.eventName} on ${event.contract.contractName} contract`,
          )
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
        case String(SmartContractNames.singleDynamicPP):
        case String(SmartContractNames.singlePP): {
          await this.singlePullPaymentBMEditedEventService.monitor(event)
          break
        }
        case String(SmartContractNames.recurringPPFreeTrial):
        case String(SmartContractNames.recurringPPPaidTrial):
        case String(SmartContractNames.recurringDynamicPP):
        case String(SmartContractNames.recurringPP): {
          await this.recurringPullPaymentBMEditedEventMonitoring.monitor(event)
          break
        }
        default: {
          this.logger.warn(
            `Contract ${event.contract.contractName} that cannot be processed!`,
          )
          break
        }
      }
    }
  }

  private async monitorSubscriptionCancelledEvents(networkId: string) {
    const events = await this.contractEventService.retrieveContractEventByType(
      ContractEventTypes.SubscriptionCancelled,
      networkId,
    )

    for (let event of events) {
      switch (event.contract.contractName) {
        case String(SmartContractNames.recurringPP):
        case String(SmartContractNames.recurringPPFreeTrial):
        case String(SmartContractNames.recurringPPPaidTrial): {
          await this.bmSubscriptionCancelledEventMonitoring.monitor(event)
          break
        }
        case String(SmartContractNames.recurringDynamicPP):
        case String(SmartContractNames.singlePP):
        case String(SmartContractNames.singleDynamicPP):
        default: {
          this.logger.warn(
            `Contract ${event.contract.contractName} that cannot be processed!`,
          )
          break
        }
      }
    }
  }
}
