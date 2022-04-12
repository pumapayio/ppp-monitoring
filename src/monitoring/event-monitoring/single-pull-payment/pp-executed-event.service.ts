import { Injectable, Logger } from '@nestjs/common'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { CreateBMSubscriptionDto } from 'src/api/bm-subscription/dto/createBMSubscription.dto'
import {
  serializeBMSubscription,
  UnserializedBMSubscription,
} from 'src/api/bm-subscription/interface/UnserializedSubscription'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { ContractEventLog, SmartContractNames } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePullPaymentPPExectutedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentPPExectutedEventMonitoring.name,
  )

  constructor(
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private bmSubscriptionsService: BMSubscriptionService,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    try {
      const web3 = this.web3Helper.getWeb3Instance(event.networkId)
      const latestBlock = Number(await web3.eth.getBlockNumber())

      // In any case, we start monitoring for future events
      this.monitorFutureEvents(event, latestBlock)

      if (event.isSyncing) {
        // TODO: we can exit at this stage and try again in some time
        // in order to allow the current sync to be finised
      }
      if (event.syncHistorical && Number(latestBlock) > event.lastSyncedBlock) {
        // TODO: retrieve all historical events as well and we set isSyncing to true
        await this.processPastEvents()
      }

      // Update the status in the DB
      await this.contractEventService.update({
        id: event.id,
        lastSyncedBlock: latestBlock,
      })
    } catch (error) {
      this.logger.debug(
        `Failed to handle pull payment execution events. Reason: ${error.message}`,
      )
    }
  }

  private async monitorFutureEvents(event: ContractEvent, latestBlock: number) {
    try {
      this.logger.log('monitoring future events')
      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.address,
        SmartContractNames[event.contractName],
        true,
      )
      // We handle pull payment executions as new subscription for single billing models
      contract.events[ContractEventTypes.NewSubscription]({
        from: event.address,
        fromBlock: latestBlock,
      })
        .on('connected', async (subscriptionId: string) => {
          console.log(subscriptionId)
        })
        .on('data', async (eventLog: ContractEventLog) => {
          const unserializedSubscription: UnserializedBMSubscription = await contract.methods
            .getSubscription(eventLog.returnValues.subscriptionID)
            .call()
          const serializedSubscription = serializeBMSubscription(
            eventLog.returnValues.billingModelID,
            eventLog.returnValues.subscriptionID,
            unserializedSubscription,
          )
          const createBMSubscription: CreateBMSubscriptionDto = Object.assign(
            serializedSubscription,
            {},
          )

          await this.bmSubscriptionsService.create(createBMSubscription)
        })
        .on('error', async (error, receipt) => {
          console.log(error, receipt)
        })
    } catch (error) {
      this.logger.debug(
        `Failed to monitor pull payment execution future events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.monitorFutureEvents(event, latestBlock)
    }
  }

  private async processPastEvents() {
    try {
      this.logger.log('processing past events')
    } catch (error) {
      this.logger.debug(
        `Failed to process pull payment execution past events. Reason: ${error.message}`,
      )
      // TODO: How to handle failed cases here ?
      // await sleep(10000) // Sleep 10 seconds and start again monitoring events
      // this.monitorFutureEvents()
    }
  }
}
