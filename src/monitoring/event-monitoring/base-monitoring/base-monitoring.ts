import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ContractEventSyncStatus } from 'src/api/contract-event/contract-event-status'
import { ContractEvent } from 'src/api/contract-event/contract-event.entity'
import { ContractEventService } from 'src/api/contract-event/contract-event.service'
import { SmartContractNames, ContractEventLog } from 'src/utils/blockchain'
import { sleep } from 'src/utils/sleep'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import { RecurringPullPaymentEventHandler } from '../recurring-pull-payment/recurring-pull-payment.event-handler'
import { SinglePullPaymentEventHandler } from '../single-pull-payment/single-pull-payment.event-handler'
import { UtilsService } from '../../../utils/utils.service'

@Injectable()
export class BaseMonitoring {
  private readonly logger = new Logger(BaseMonitoring.name)
  private connectionId: string

  constructor(
    private config: ConfigService,
    private utils: UtilsService,
    private web3Helper: Web3Helper,
    private contractEventService: ContractEventService,
  ) {}
  public async monitor(
    event: ContractEvent,
    merchantAddresses: string[],
    eventHandler:
      | SinglePullPaymentEventHandler
      | RecurringPullPaymentEventHandler,
    handleEventLog: (
      contract: any,
      merchantAddresses: string[],
      event: ContractEvent,
      eventLog: ContractEventLog,
      eventHandler:
        | SinglePullPaymentEventHandler
        | RecurringPullPaymentEventHandler,
      utils: UtilsService,
    ) => Promise<void>,
  ): Promise<void> {
    const web3 = this.web3Helper.getWeb3Instance(event.networkId)
    try {
      const currentBlockNumber = Number(await web3.eth.getBlockNumber())

      if (
        event.syncHistorical &&
        Number(currentBlockNumber) > event.lastSyncedBlock
      ) {
        console.log('currentBlockNumber: ', currentBlockNumber)

        await this.contractEventService.update({
          id: event.id,
          syncStatus: ContractEventSyncStatus.ProcessingPastEvents,
        })
        await this.processPastEvents(
          event,
          merchantAddresses,
          currentBlockNumber,
          handleEventLog,
          eventHandler,
        )
      }
      await this.monitorFutureEvents(
        event,
        merchantAddresses,
        currentBlockNumber,
        handleEventLog,
        eventHandler,
      )
      this.ensureFutureEventMonitoring(
        event,
        merchantAddresses,
        currentBlockNumber,
        handleEventLog,
        eventHandler,
      )
    } catch (error) {
      this.logger.debug(
        `Failed to handle ${event.eventName} events. Reason: ${error.message}`,
      )
    }
  }

  private async monitorFutureEvents(
    event: ContractEvent,
    merchantAddresses: string[],
    currentBlockNumber: number,
    handleEventLog: Function,
    eventHandler:
      | SinglePullPaymentEventHandler
      | RecurringPullPaymentEventHandler,
  ): Promise<any> {
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
      return contract.events[event.eventName]({
        from: event.contractAddress,
        fromBlock: currentBlockNumber,
      })
        .on('connected', (connectionId) => {
          this.connectionId = connectionId
          this.logger.debug(
            `Connected to WS for ${event.eventName} event and ${event.contract.contractName} contract. Connection_Id: ${connectionId}`,
          )
        })
        .on('data', async (eventLog: ContractEventLog) => {
          try {
            await handleEventLog(
              contract,
              merchantAddresses,
              event,
              eventLog,
              eventHandler,
              this.utils,
            )
            await this.contractEventService.update({
              id: event.id,
              lastSyncedBlock: eventLog.blockNumber,
            })
            return true
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
        merchantAddresses,
        currentBlockNumber,
        handleEventLog,
        eventHandler,
      )
    }
  }

  private async processPastEvents(
    event: ContractEvent,
    merchantAddresses: string[],
    currentBlockNumber: number,
    handleEventLog: Function,
    eventHandler:
      | SinglePullPaymentEventHandler
      | RecurringPullPaymentEventHandler,
  ): Promise<void> {
    try {
      this.logger.log(
        `Processing ${event.eventName} events. Latest block: ${currentBlockNumber} - Start Block ${event.lastSyncedBlock}`,
      )
      let startBlock = Number(event.lastSyncedBlock) - 1
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
          },
        )
        // console.log('pastEvents', pastEvents)

        this.logger.log(
          `Found ${pastEvents.length} ${event.eventName} past events for ${event.contract.contractName}.`,
        )

        const bundleThreshold = 20 // handle 20 events per iteration
        if (pastEvents && pastEvents.length) {
          const bundledPromises = []
          for (const pastEvent of pastEvents) {
            bundledPromises.push(
              new Promise(async (resolve, reject) => {
                try {
                  resolve(
                    await handleEventLog(
                      contract,
                      merchantAddresses,
                      event,
                      pastEvent,
                      eventHandler,
                      this.utils,
                    ),
                  )
                } catch (error) {
                  reject(error)
                }
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
        `Failed to process ${event.eventName} past events. Reason: ${error.message}`,
      )
      await sleep(10000) // Sleep 10 seconds and start again monitoring events
      this.processPastEvents(
        event,
        merchantAddresses,
        currentBlockNumber,
        handleEventLog,
        eventHandler,
      )
    }
  }

  private async ensureFutureEventMonitoring(
    event: ContractEvent,
    merchantAddresses: string[],
    currentBlockNumber: number,
    handleEventLog: Function,
    eventHandler:
      | SinglePullPaymentEventHandler
      | RecurringPullPaymentEventHandler,
  ): Promise<void> {
    // give 15 seconds for the ws connection to be established
    await sleep(15000)
    // if there is no connection id, it means that we never managed to connect
    while (!this.connectionId) {
      // TODO: Fix this part so that we really try to connect again ...
      this.logger.log(
        `No connection id yet, trying again... ${event.eventName} ${this.connectionId}`,
      )
      // so, we try to connect again
      await this.monitorFutureEvents(
        event,
        merchantAddresses,
        currentBlockNumber,
        handleEventLog,
        eventHandler,
      )
      // we give 15 seconds before we check again a connection is establised
      await sleep(15000)
    }
  }
}
