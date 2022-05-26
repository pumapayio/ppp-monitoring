import { Injectable, Logger } from '@nestjs/common'
import { OperationModes } from '../operationModes'

const Web3 = require('web3')

@Injectable()
export class Web3Connector {
  private static logger: Logger
  private static instance: Web3Connector
  private static web3Providers: any = {}
  private static web3HttpProviders: any = {}
  private constructor() {
    Web3Connector.logger = new Logger('Web3Connector')
  }

  public static getInstance(): Web3Connector {
    if (!Web3Connector.instance) {
      Web3Connector.instance = new Web3Connector()
    }

    return Web3Connector.instance
  }

  public static getWeb3WsProvider(networkId: string) {
    return Web3Connector.web3Providers[networkId]
  }

  public static getWeb3HttpProvider(networkId: string) {
    return Web3Connector.web3HttpProviders[networkId]
  }

  public static instantiateWsProvider(networkId: string, rpcURL: string) {
    if (!Web3Connector.web3Providers[networkId]) {
      let web3 = new Web3()
      const eventProvider = new Web3.providers.WebsocketProvider(rpcURL, {
        timeout: 60000, // ms
        clientConfig: {
          // Useful if requests are large
          maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
          maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
          // Useful to keep a connection alive
          keepalive: true,
          keepaliveInterval: 60000, // ms
        },
        // Enable auto reconnection
        reconnect: {
          auto: true,
          delay: 10000, // ms
          maxAttempts: 30, // we try for 5 minutes
          onTimeout: false,
        },
      })

      eventProvider.on('connect', () => {
        Web3Connector.logger.log(
          `Web3 connected for network ${networkId} on ${rpcURL}!!`,
        )
      })
      eventProvider.on('error', () => {
        Web3Connector.logger.error(
          `Web3 connection error for network ${networkId}!`,
        )
      })
      eventProvider.on('end', () => {
        Web3Connector.logger.warn(
          `Web3 connection ended for network ${networkId}!`,
        )
      })

      eventProvider.on('close', () => {
        Web3Connector.logger.warn(
          `Web3 connection closed for network ${networkId}!`,
        )
      })

      web3.setProvider(eventProvider)
      // We can do monitoring based on the "executor mode"
      web3 = Web3Connector.setupDefaultAccount(web3)
      this.web3Providers[networkId] = web3
    } else {
      Web3Connector.logger.log(
        `Web3 WS Provider connected already for network ${networkId}!!`,
      )
    }
  }

  public static instantiateHttpProvider(networkId: string, rpcUrl: string) {
    if (networkId === undefined || networkId === null)
      throw new Error('No network ID provided!')
    if (!Web3Connector.web3HttpProviders[networkId]) {
      let web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
      if (process.env.OPERATION_MODE === OperationModes.Executor) {
        web3 = Web3Connector.setupDefaultAccount(web3)
      }
      this.web3HttpProviders[networkId] = web3
    } else {
      Web3Connector.logger.log(
        `Web3 Http Provider connected already for network ${networkId}!!`,
      )
    }
  }

  private static setupDefaultAccount(web3) {
    const privateKey = process.env.EXECUTOR_PRIVATE_KEY
    const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAccount = account.address

    return web3
  }
}
