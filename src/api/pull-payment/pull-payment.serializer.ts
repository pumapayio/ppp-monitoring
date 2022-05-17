import { BigNumber } from 'bignumber.js'
import { CreatePullPaymentDto } from './dto/create-pull-payment.dto'
import { TransactionReceipt } from 'web3-core'
import { BlockchainGlobals, SmartContractNames } from '../../utils/blockchain'
import Web3 from 'web3'

export interface UnserializedPullPayment {
  billingModelID: string
  subscriptionID: string
  pullPaymentID: string
  paymentAmount: BigNumber
  executionTimestamp: string
}

export async function serializePullPayment(
  pullPaymentId: string,
  bmSubscriptionId: string,
  billingModelId: string,
  contractAddress: string,
  networkId: string,
  pullPayment: UnserializedPullPayment,
  transactionHash: string,
  merchantAddress: string,
  web3: Web3,
): Promise<CreatePullPaymentDto> {
  const transactionAmounts = await extractPullPaymentAmounts(
    networkId,
    transactionHash,
    merchantAddress,
    web3,
  )

  return {
    pullPaymentId,
    bmSubscriptionId,
    billingModelId,
    contractAddress,
    networkId,
    paymentAmount: String(transactionAmounts.paymentAmount),
    executionFeeAmount: String(transactionAmounts.executionFeeAmount),
    receivingAmount: String(transactionAmounts.receivingAmount),
    executionTimestamp: pullPayment.executionTimestamp,
    transactionHash: transactionHash,
  } as CreatePullPaymentDto
}

const extractPullPaymentAmounts = async (
  networkId: string,
  transactionHash: string,
  merchantAddress: string,
  web3: Web3,
) => {
  const transactionReceipt: TransactionReceipt =
    await web3.eth.getTransactionReceipt(transactionHash)

  // 0xc9fdd1778b659E051290E40bdBbd88709FD56900
  const executorAddress = BlockchainGlobals.GET_CONTRACT_ADDRESS(
    networkId,
    SmartContractNames.executorReceiver,
  )
  // 0xb2A80b679F87530EdFB848708CA948cbF25Ca3e0
  const executorContractAddress = BlockchainGlobals.GET_CONTRACT_ADDRESS(
    networkId,
    SmartContractNames.executor,
  )

  let executionFeeAmount: string
  let receivingAmount: string
  let paymentAmount: string

  // console.log(' =======  =======  =======  =======  =======  ======= ')
  // console.log(executorContractAddress)
  // console.log(executorAddress)
  transactionReceipt?.logs.filter((event) => {
    const transferEventTopic =
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    const isTransferEvent = event?.topics[0]?.toString() === transferEventTopic

    if (isTransferEvent) {
      const parsedEvent = web3.eth.abi.decodeLog(
        [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        event.data,
        [event.topics[1], event.topics[2]],
      )
      // console.log(parsedEvent)

      if (
        parsedEvent['from']?.toLocaleLowerCase() ===
          executorContractAddress.toLocaleLowerCase() &&
        parsedEvent['to']?.toLocaleLowerCase() ===
          executorAddress.toLocaleLowerCase()
      ) {
        // get execution fee
        executionFeeAmount = Number(
          parsedEvent['value']?.toString(),
        ).toLocaleString('en-US', {
          useGrouping: false,
        })

        return true
      }

      // get amount received by merchant
      if (
        parsedEvent['to']?.toLocaleLowerCase() ==
        merchantAddress.toLocaleLowerCase()
      ) {
        receivingAmount = Number(
          parsedEvent['value']?.toString(),
        ).toLocaleString('en-US', {
          useGrouping: false,
        })

        return true
      }

      // get amount paid by payee
      if (
        parsedEvent['from']?.toLocaleLowerCase() !==
          executorContractAddress.toLocaleLowerCase() &&
        parsedEvent['to']?.toLocaleLowerCase() ===
          executorContractAddress.toLocaleLowerCase()
      ) {
        paymentAmount = Number(parsedEvent['value']?.toString()).toLocaleString(
          'en-US',
          {
            useGrouping: false,
          },
        )
        return true
      }
    }
    return false
  })
  // console.log(' =======  =======  =======  =======  =======  ======= ')
  return {
    executionFeeAmount: executionFeeAmount,
    receivingAmount: receivingAmount,
    paymentAmount: paymentAmount,
  }
}
