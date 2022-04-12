import { Injectable, Logger } from '@nestjs/common'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import { UpdateBMDto } from 'src/api/billiing-model/dto/updateBM.dto'
import {
  serializeBMDetails,
  UnserializedBillingModel,
} from 'src/api/billiing-model/interface/UnserializedBMDetails'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import {
  BillingModelEditedEvent,
  ContractEventLog,
  SmartContractNames,
} from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePullPaymentBMEditedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMEditedEventMonitoring.name,
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
      contract.events[ContractEventTypes.BillingModelEdited]({
        from: event.address,
        fromBlock: latestBlock,
      })
        .on('connected', (subscriptionId: string) => {
          console.log(subscriptionId)
        })
        .on('data', async (eventLog: ContractEventLog) => {
          try {
            // ==================================================================
            // TODO: This approach is better as we don't make another call to retreive the bm details
            // from the blokchain - need to figure out why we are getting `Invalid UTF-8 detected` and
            // `Invalid continuation byte` errors though with this approach
            // ==================================================================
            // const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
            // const eventData: BillingModelEditedEvent = eventLog.returnValues
            // console.log(eventData)
            // const updateBM: UpdateBMDto = {
            //   billingModelId: eventData.billingModelID,
            //   name: web3Utils.hexToUtf8(eventData.newName),
            //   amount: eventData.amount,
            //   sellingToken: eventData.settlementToken,
            //   settlementToken: eventData.settlementToken,
            //   payee: eventData.newPayee,
            // }
            // console.log(updateBM)
            const web3Utils = this.web3Helper.getWeb3Utils(event.networkId)
            const unserializedBillingModel: UnserializedBillingModel = await contract.methods
              .getBillingModel(eventLog.returnValues.billingModelID)
              .call()
            const updateBM = serializeBMDetails(
              eventLog.returnValues.billingModelID,
              unserializedBillingModel,
              web3Utils,
            )
            updateBM.billingModelId = eventLog.returnValues.billingModelID

            this.billingModelService.update(updateBM)
          } catch (e) {
            this.logger.error(
              `Failed to process contract event. Reason: ${e.message}`,
            )
            // Sleep 10 seconds and start again monitoring events
            sleep(10000).then(() =>
              this.monitorFutureEvents(event, latestBlock),
            )
          }
        })
        .on('error', (error, receipt) => {
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
