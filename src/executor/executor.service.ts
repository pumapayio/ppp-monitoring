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

  @Cron(process.env.SCEDULER_CRON_EXPRESSION || CronExpression.EVERY_5_MINUTES)
  public async processUpcomingPullPaymentExecutions() {
    this.logger.debug(`Processing upcoming pull payment executions`)

    try {
      // We first need to retrieve upcoming pull payment executions
      const upcomingSubscriptions =
        await this.bmSubscriptionsService.retrieveUpcomingSubscriptions()

      for (let upcomingSubscription of upcomingSubscriptions) {
        console.log('upcomingSubscription', upcomingSubscription)
        await this.executePullPayment(
          upcomingSubscription.networkId,
          upcomingSubscription.billingModel.contract.contractName,
          upcomingSubscription.bmSubscriptionId,
          upcomingSubscription.billingModelId,
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
    billingModelType: string,
    bmSubscriptionId: string,
    billingModelId: string,
  ) {
    const contract = await this.web3Helper.getContractInstance(
      networkId,
      BlockchainGlobals.GET_CONTRACT_ADDRESS(
        networkId,
        SmartContractNames.executor,
      ),
      SmartContractNames.executor,
    )

    const web3 = this.web3Helper.getWeb3Instance(networkId)
    console.log(
      'billingModelType, bmSubscriptionId',
      billingModelType,
      bmSubscriptionId,
    )
    try {
      const estimatedGas = await contract.methods
        .execute(billingModelType, bmSubscriptionId)
        .estimateGas()
      const pendingNonce = await web3.eth.getTransactionCount(
        web3.eth.defaultAccount,
        'pending',
      )

      await contract.methods
        .execute(billingModelType, bmSubscriptionId)
        .send({
          from: web3.eth.defaultAccount,
          gas: estimatedGas,
          nonce: pendingNonce,
        })
        .on('transactionHash', (hash) => {
          console.log('transactionHash', hash)
        })
        // .on('confirmation', (confirmationNumber, receipt) => {
        //   console.log('confirmation', confirmationNumber)
        // })
        .on('receipt', (receipt) => {
          console.log('receipt', receipt.transactionHash)
        })
        .on('error', (error, receipt) => {
          console.log(error, receipt)
          this.logger.error(
            `Pull payment execution TX failed. <BM_TYPE-BM_ID-SUB_ID>=<${billingModelType}-${billingModelId}-${bmSubscriptionId}>. Reason: ${error.message}`,
          )
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        })
    } catch (error) {
      this.logger.error(
        `Failed to execute pull payment. <BM_TYPE-BM_ID-SUB_ID>=<${billingModelType}-${billingModelId}-${bmSubscriptionId}>. Reason: ${error.message}`,
      )
    }
  }
}
