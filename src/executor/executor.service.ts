import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { BlockchainGlobals, SmartContractNames } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'

@Injectable()
export class ExecutorService {
  private readonly logger = new Logger(ExecutorService.name)

  public constructor(
    private web3Helper: Web3Helper,
    private bmSubscriptionsService: BMSubscriptionService,
  ) {}
  // TODO: Make the cron job as an app config
  @Cron(process.env.SCEDULER_CRON_EXPRESSION || CronExpression.EVERY_5_MINUTES)
  public async processUpcomingPullPaymentExecutions() {
    this.logger.debug(`Processing upcoming pull payment executions`)
    try {
      // We first need to retrieve upcoming pull payment executions
      const upcomingSubscriptions =
        await this.bmSubscriptionsService.retrieveUpcomingSubscriptions()

      for (let upcomingSubscription of upcomingSubscriptions) {
        console.log(upcomingSubscription)
        this.executePullPayment(
          upcomingSubscription.networkId,
          upcomingSubscription.contractAddress,
          upcomingSubscription.billingModel.contract.contractName,
          upcomingSubscription.bmSubscriptionId,
        )
      }
      // Then for each upcoming one, we must call the 'execute()' on the correct smart contract
    } catch (error) {
      this.logger.debug(
        `Failed to process upcoming pull payment executions. Reason: ${error.message}`,
      )
    }
  }

  private async executePullPayment(
    networkId: string,
    contractAddress: string,
    billingModelType: string,
    bmSubscriptionId: string,
  ) {
    console.log(billingModelType, bmSubscriptionId)
    try {
      const contract = await this.web3Helper.getContractInstance(
        networkId,
        BlockchainGlobals.GET_CONTRACT_ADDRESS(
          networkId,
          SmartContractNames.executor,
        ),
        SmartContractNames.executor,
      )
      const web3 = this.web3Helper.getWeb3Instance(networkId)
      const estimatedGas = await contract.methods
        .execute(billingModelType, bmSubscriptionId)
        .estimateGas()
      console.log(estimatedGas)
      console.log('web3.eth.defaultAccount', web3.eth.defaultAccount)
      await contract.methods
        .execute(billingModelType, bmSubscriptionId)
        .send({
          from: web3.eth.defaultAccount,
          gas: estimatedGas,
        })
        .on('transactionHash', (hash) => {
          console.log(hash)
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          console.log(confirmationNumber, receipt)
        })
        .on('receipt', (receipt) => {
          console.log(receipt)
        })
        .on('error', (error, receipt) => {
          console.log(error, receipt)
          this.logger.error(
            `Execute pull payment tx failed - <${billingModelType}-${bmSubscriptionId}>. Reason: ${error.message}`,
          )
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        })
    } catch (error) {
      this.logger.error(
        `Failed to execute pull payment <${billingModelType}-${bmSubscriptionId}>. Reason: ${error.message}`,
      )
    }
  }
}
