import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import {
  serializeBMDetails,
  UnserializedBillingModel,
} from 'src/api/billiing-model/billing-model.serializer'
import { ContractEventSyncStatus } from 'src/api/contract-event/contract-event-status'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { ContractEventLog, SmartContractNames } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePullPaymentBMEditedEventMonitoring {
  private readonly logger = new Logger(
    SinglePullPaymentBMEditedEventMonitoring.name,
  )

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private billingModelService: BillingModelService,
  ) {}

  public async monitor(event: ContractEvent): Promise<void> {
    try {
      const web3 = this.web3Helper.getWeb3Instance(event.networkId)
      const currentBlockNumber = Number(await web3.eth.getBlockNumber())

      if (
        event.syncHistorical &&
        Number(currentBlockNumber) > event.lastSyncedBlock
      ) {
        await this.contractEventService.update({
          id: event.id,
          syncStatus: ContractEventSyncStatus.ProcessingPastEvents,
        })

        await this.processPastEvents(event, currentBlockNumber)
      }

      // In any case, we start monitoring for future events
      this.monitorFutureEvents(event, currentBlockNumber)
    } catch (error) {
      this.logger.debug(
        `Failed to handle billing model edit events. Reason: ${error.message}`,
      )
    }
  }

  private async monitorFutureEvents(
    event: ContractEvent,
    currentBlockNumber: number,
  ) {
    this.logger.log(
      `Monitoring BM Edited future events. Starting block: ${currentBlockNumber}`,
    )
    try {
      await this.contractEventService.update({
        id: event.id,
        syncStatus: ContractEventSyncStatus.ProcessingFutureEvents,
      })
      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.contractAddress,
        SmartContractNames[event.contract.contractName],
        true,
      )
      contract.events[ContractEventTypes.BillingModelEdited]({
        from: event.contractAddress,
        fromBlock: currentBlockNumber,
      })
        .on('data', async (eventLog: ContractEventLog) => {
          try {
            await this.handleEventLog(contract, event, eventLog)
          } catch (e) {
            this.logger.error(
              `Failed to process contract event. Reason: ${e.message}`,
            )
            // Sleep 10 seconds and start again monitoring events
            sleep(10000).then(() =>
              this.monitorFutureEvents(event, currentBlockNumber),
            )
          }
        })
        .on('error', (error, receipt) => {
          this.logger.error(
            `Something went wrong with fetching the event`,
            error,
            receipt,
          )
        })
    } catch (error) {
      this.logger.debug(
        `Failed to monitor billing model edit future events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.monitorFutureEvents(event, currentBlockNumber)
    }
  }

  private async processPastEvents(
    event: ContractEvent,
    currentBlockNumber: number,
  ) {
    this.logger.log(
      `Processing BM Edited past events. Latest block: ${currentBlockNumber} - Start Block ${event.lastSyncedBlock}`,
    )
    try {
      let startBlock = event.lastSyncedBlock
      const blockScanThreshold = this.config.get(
        'blockchain.blockScanThreshold',
      )
      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.contractAddress,
        SmartContractNames[event.contract.contractName],
      )

      while (startBlock < currentBlockNumber) {
        const toBlock = Number(
          startBlock + blockScanThreshold < currentBlockNumber
            ? startBlock + blockScanThreshold
            : currentBlockNumber,
        )
        this.logger.log(
          `Fetching BM Edited past events for ${event.contract.contractName}.`,
        )
        this.logger.log(
          `Starting block: ${startBlock} - End Block: ${toBlock} - Network: ${event.networkId}`,
        )

        const pastEvents = await contract.getPastEvents(
          String(ContractEventTypes.BillingModelEdited),
          {
            fromBlock: startBlock,
            toBlock: toBlock,
            topics: [event.topic],
          },
        )
        this.logger.log(
          `Found ${pastEvents.length} BM Edited past events for ${event.contract.contractName}.`,
        )
        const bundleThreshold = 20 // handle 20 events per iteration
        if (pastEvents && pastEvents.length) {
          const bundledPromises = []
          for (const pastEvent of pastEvents) {
            bundledPromises.push(
              new Promise(async (resolve) => {
                resolve(await this.handleEventLog(contract, event, pastEvent))
              }),
            )
            startBlock = Number(pastEvent.blockNumber)
            if (bundledPromises.length === bundleThreshold) {
              await Promise.all(bundledPromises.splice(0, bundleThreshold))
              await this.contractEventService.update({
                id: event.id,
                lastSyncedTxHash: pastEvent.transactionHash,
                lastSyncedBlock: pastEvent.blockNumber,
              })
            }
          }
          await Promise.all(bundledPromises.splice(0, bundleThreshold))
          await this.contractEventService.update({
            id: event.id,
            lastSyncedTxHash: pastEvents[pastEvents.length - 1].transactionHash,
            lastSyncedBlock: pastEvents[pastEvents.length - 1].blockNumber,
          })
        }
        startBlock = Number(
          startBlock + blockScanThreshold < currentBlockNumber
            ? startBlock + blockScanThreshold
            : currentBlockNumber,
        )
        await this.contractEventService.update({
          id: event.id,
          lastSyncedBlock: startBlock,
        })
      }
    } catch (error) {
      this.logger.debug(
        `Failed to process billing model edit past events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.processPastEvents(event, currentBlockNumber)
    }
  }

  private async handleEventLog(
    contract: any,
    event: ContractEvent,
    eventLog: ContractEventLog,
  ) {
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
      event.contractAddress,
      event.networkId,
      unserializedBillingModel,
      web3Utils,
    )
    updateBM.billingModelId = eventLog.returnValues.billingModelID

    this.billingModelService.update(updateBM)
  }
}
