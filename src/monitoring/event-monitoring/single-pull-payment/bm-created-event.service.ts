import { Injectable, Logger } from '@nestjs/common'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import { CreateBMDto } from 'src/api/billiing-model/dto/createBM.dto'
import {
  serializeBMDetails,
  UnserializedBillingModel,
} from 'src/api/billiing-model/interface/UnserializedBMDetails'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { ContractEventLog, SmartContractNames } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePullPaymentBMCreatedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMCreatedEventMonitoring.name,
  )

  constructor(
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private billingModelService: BillingModelService,
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
        `Failed to handle billing model creation events. Reason: ${error.message}`,
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
      contract.events[ContractEventTypes.BillingModelCreated]({
        from: event.address,
        fromBlock: latestBlock,
      })
        .on('connected', async (subscriptionId: string) => {
          console.log(subscriptionId)
        })
        .on('data', async (eventLog: ContractEventLog) => {
          const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
          const unserializedBillingModel: UnserializedBillingModel = await contract.methods
            .getBillingModel(eventLog.returnValues.billingModelID)
            .call()
          const billinModelDetails = serializeBMDetails(
            eventLog.returnValues.billingModelID,
            unserializedBillingModel,
            web3Utils,
          )
          billinModelDetails.billingModelId =
            eventLog.returnValues.billingModelID

          await this.billingModelService.create(billinModelDetails)
        })
        .on('error', async (error, receipt) => {
          console.log(error, receipt)
        })
    } catch (error) {
      this.logger.debug(
        `Failed to monitor billing model creation future events. Reason: ${error.message}`,
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
        `Failed to process billing model creation past events. Reason: ${error.message}`,
      )
      // TODO: How to handle failed cases here ?
      // await sleep(10000) // Sleep 10 seconds and start again monitoring events
      // this.monitorFutureEvents()
    }
  }
}
