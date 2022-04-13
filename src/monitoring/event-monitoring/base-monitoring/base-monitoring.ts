import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BillingModelService } from 'src/api/billiing-model/billing-model.service'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { ContractEventSyncStatus } from 'src/api/contract-event/contract-event-status'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { PullPaymentService } from 'src/api/pull-payment/pull-payment.service'
import { SmartContractNames, ContractEventLog } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

export class BaseMonitoring {
  private readonly logger = new Logger(BaseMonitoring.name)
  private connectionId: string

  constructor(
    private config: ConfigService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
  ) {}

  public async monitor(
    event: ContractEvent,
    entityService:
      | BillingModelService
      | BMSubscriptionService
      | PullPaymentService,
    handleEventLog: (
      contract: any,
      event: ContractEvent,
      eventLog: ContractEventLog,
      entityService?:
        | BillingModelService
        | BMSubscriptionService
        | PullPaymentService,
      web3Helper?: Web3Helper,
      secondEntityService?:
        | BillingModelService
        | BMSubscriptionService
        | PullPaymentService,
    ) => Promise<void>,
    secondEntityService?:
      | BillingModelService
      | BMSubscriptionService
      | PullPaymentService,
  ): Promise<void> {
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

        this.processPastEvents(
          event,
          currentBlockNumber,
          handleEventLog,
          entityService,
          secondEntityService,
        )
      }

      this.monitorFutureEvents(
        event,
        currentBlockNumber,
        handleEventLog,
        entityService,
        secondEntityService,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to handle ${event.eventName} events. Reason: ${error.message}`,
      )
    }
  }

  private async monitorFutureEvents(
    event: ContractEvent,
    currentBlockNumber: number,
    handleEventLog: Function,
    entityService: any,
    secondEntityService: any,
  ) {
    this.logger.log(
      `Monitoring ${event.eventName} future events. Starting block: ${currentBlockNumber}`,
    )
    try {
      const contract = await this.web3Helper.getContractInstance(
        event.networkId,
        event.contractAddress,
        SmartContractNames[event.contract.contractName],
        true,
      )
      // We handle pull payment executions as new subscription for single billing models
      contract.events[event.eventName]({
        from: event.contractAddress,
        fromBlock: currentBlockNumber,
      })
        .on('connected', (connectionId) => {
          this.connectionId = connectionId
          this.logger.debug(
            `Connected to WS for ${event.eventName} event. Connection_Id: ${connectionId}`,
          )
        })
        .on('data', async (eventLog: ContractEventLog) => {
          try {
            await handleEventLog(
              contract,
              event,
              eventLog,
              entityService,
              this.web3Helper,
              secondEntityService,
            )
            console.log(eventLog.blockNumber)
            await this.contractEventService.update({
              id: event.id,
              lastSyncedBlock: eventLog.blockNumber,
            })
          } catch (error) {
            this.logger.debug(
              `Failed to handle ${event.eventName} event. Reason: ${error.message}`,
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
        `Failed to monitor ${event.eventName} future events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.monitorFutureEvents(
        event,
        currentBlockNumber,
        handleEventLog,
        entityService,
        secondEntityService,
      )
    }
  }

  private async processPastEvents(
    event: ContractEvent,
    currentBlockNumber: number,
    handleEventLog: Function,
    entityService: any,
    secondEntityService: any,
  ) {
    this.logger.log(
      `Processing ${event.eventName} events. Latest block: ${currentBlockNumber} - Start Block ${event.lastSyncedBlock}`,
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
          `Fetching ${event.eventName} past events for ${event.contract.contractName}.`,
        )
        this.logger.log(
          `Starting block: ${startBlock} - End Block: ${toBlock} - Network: ${event.networkId}`,
        )

        const pastEvents = await contract.getPastEvents(
          String(event.eventName),
          {
            fromBlock: startBlock,
            toBlock: toBlock,
            topics: [event.topic],
          },
        )
        this.logger.log(
          `Found ${pastEvents.length} ${event.eventName} past events for ${event.contract.contractName}.`,
        )

        const bundleThreshold = 20 // handle 20 events per iteration
        if (pastEvents && pastEvents.length) {
          const bundledPromises = []
          for (const pastEvent of pastEvents) {
            console.log(pastEvent)
            bundledPromises.push(
              new Promise(async (resolve) => {
                resolve(
                  await handleEventLog(
                    contract,
                    event,
                    pastEvent,
                    entityService,
                    this.web3Helper,
                    secondEntityService,
                  ),
                )
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
        console.log('startBlock', startBlock)
        await this.contractEventService.update({
          id: event.id,
          lastSyncedBlock: startBlock,
        })
      }
    } catch (error) {
      this.logger.debug(
        `Failed to process ${event.eventName} past events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.processPastEvents(
        event,
        currentBlockNumber,
        handleEventLog,
        entityService,
        secondEntityService,
      )
    }
  }
}
