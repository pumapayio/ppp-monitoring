import { Injectable, Logger } from '@nestjs/common'
import { BMSubscriptionService } from 'src/api/bm-subscription/bm-subscription.service'
import { BlockchainGlobals, SmartContractNames } from 'src/utils/blockchain'
import { Web3Helper } from 'src/utils/web3Connector/web3Helper'
import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

@Injectable()
export class ExecutorService {
  private readonly logger = new Logger(ExecutorService.name)

  public constructor(
    private web3Helper: Web3Helper,
    private bmSubscriptionsService: BMSubscriptionService,
  ) {}

  public async processUpcomingPullPaymentExecutions(networkId: string) {
    this.logger.debug(
      `Processing upcoming pull payment executions on network ${networkId}`,
    )
    const web3 = this.web3Helper.getWeb3Instance(networkId)
    try {
      // We first need to retrieve upcoming pull payment executions
      const upcomingSubscriptions =
        await this.bmSubscriptionsService.retrieveUpcomingSubscriptions(
          networkId,
        )

      if (upcomingSubscriptions.length > 0) {
        const contract = await this.web3Helper.getContractInstance(
          networkId,
          BlockchainGlobals.GET_CONTRACT_ADDRESS(
            networkId,
            SmartContractNames.executor,
          ),
          SmartContractNames.executor,
        )
        for (let upcomingSubscription of upcomingSubscriptions) {
          await this.executePullPayment(
            web3,
            contract,
            upcomingSubscription.billingModel.contract.contractName,
            upcomingSubscription.bmSubscriptionId,
            upcomingSubscription.billingModelId,
          )
        }
      }
    } catch (error) {
      this.logger.debug(
        `Failed to process upcoming pull payment executions. Reason: ${error.message}`,
      )
    }
  }

  private async executePullPayment(
    web3: Web3,
    contract: Contract,
    billingModelType: string,
    bmSubscriptionId: string,
    billingModelId: string,
  ) {
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
          this.logger.debug('On Tx Hash - tx hash', hash)
        })
        .on('receipt', (receipt) => {
          this.logger.debug('On Receipt - tx receipt', receipt.transactionHash)
        })
        .on('error', (error, receipt) => {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          this.logger.error(
            `Pull payment execution TX failed. <BM_TYPE-BM_ID-SUB_ID>=<${billingModelType}-${billingModelId}-${bmSubscriptionId}>. Reason: ${error.message}`,
          )
        })
    } catch (error) {
      this.logger.error(
        `Failed to execute pull payment. <BM_TYPE-BM_ID-SUB_ID>=<${billingModelType}-${billingModelId}-${bmSubscriptionId}>. Reason: ${error.message}`,
      )
    }
  }
}
