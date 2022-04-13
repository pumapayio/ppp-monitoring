import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContractEventSyncStatus } from 'src/api/contract-event/contract-event-status'
import { ContractEventTypes } from 'src/api/contract-event/contract-event-types'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { PullPaymentService } from 'src/api/pull-payment/pull-payment.service'
import { ContractEventLog, SmartContractNames } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class SinglePPExectutionEventMonitoring {
  private readonly logger = new Logger(SinglePPExectutionEventMonitoring.name)
  private readonly WS_CONNECTION: boolean = true

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
    private pullPaymentService: PullPaymentService,
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
        `Failed to handle billing model creation events. Reason: ${error.message}`,
      )
    }
  }

  private async monitorFutureEvents(
    event: ContractEvent,
    currentBlockNumber: number,
  ) {
    this.logger.log(
      `Monitoring PP Execution future events. Starting block: ${currentBlockNumber}`,
    )
    try {
      await this.contractEventService.update({
        id: event.id,
        syncStatus: ContractEventSyncStatus.ProcessingFutureEvents,
      })

      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.address,
        SmartContractNames[event.contractName],
        this.WS_CONNECTION,
      )
      // We handle pull payment executions as new subscription for single billing models
      contract.events[ContractEventTypes.NewSubscription]({
        from: event.address,
        fromBlock: currentBlockNumber,
      })
        .on('data', async (eventLog: ContractEventLog) => {
          try {
            await this.handleEventLog(contract, eventLog)
          } catch (error) {
            this.logger.debug(
              `Failed to handle pull payment execution event. Reason: ${error.message}`,
            )
          }
        })
        .on('error', async (error, receipt) => {
          this.logger.error(
            `Something went wrong with fetching the event`,
            error,
            receipt,
          )
        })
    } catch (error) {
      this.logger.debug(
        `Failed to monitor pull payment execution future events. Reason: ${error.message}`,
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
      `Processing PP Executed past events. Latest block: ${currentBlockNumber} - Start Block ${event.lastSyncedBlock}`,
    )
    try {
      let startBlock = event.lastSyncedBlock
      const blockScanThreshold = this.config.get(
        'blockchain.blockScanThreshold',
      )
      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.address,
        SmartContractNames[event.contractName],
      )

      while (startBlock < currentBlockNumber) {
        const toBlock = Number(
          startBlock + blockScanThreshold < currentBlockNumber
            ? startBlock + blockScanThreshold
            : currentBlockNumber,
        )
        this.logger.log(
          `Fetching PP Executed past events for ${event.contractName}.`,
        )
        this.logger.log(
          `Starting block: ${startBlock} - End Block: ${toBlock} - Network: ${event.networkId}`,
        )

        const pastEvents = await contract.getPastEvents(
          String(ContractEventTypes.NewSubscription),
          {
            fromBlock: startBlock,
            toBlock: toBlock,
            topics: [event.topic],
          },
        )
        this.logger.log(
          `Found ${pastEvents.length} PP Executed past events for ${event.contractName}.`,
        )

        const bundleThreshold = 20 // handle 20 events per iteration
        if (pastEvents && pastEvents.length) {
          const bundledPromises = []
          for (const pastEvent of pastEvents) {
            bundledPromises.push(
              new Promise(async (resolve) => {
                resolve(await this.handleEventLog(contract, pastEvent))
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
        `Failed to process pull payment execution past events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.processPastEvents(event, currentBlockNumber)
    }
  }

  private async handleEventLog(contract: any, eventLog: ContractEventLog) {
    // console.log(eventLog)
    // const unserializedSubscription: UnserializedBMSubscription = await contract.methods
    //   .getSubscription(eventLog.returnValues.subscriptionID)
    //   .call()
    // const serializedSubscription = serializeBMSubscription(
    //   eventLog.returnValues.billingModelID,
    //   eventLog.returnValues.subscriptionID,
    //   unserializedSubscription,
    // )
    // const createBMSubscription: CreateBMSubscriptionDto = Object.assign(
    //   serializedSubscription,
    //   {},
    // )
    // await this.pullPaymentService.create(createBMSubscription)
  }
}
