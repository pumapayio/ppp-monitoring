import { Injectable, Logger } from '@nestjs/common'

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

  public static getWeb3WsProvider(networkID: number) {
    return Web3Connector.web3Providers[networkID]
  }

  public static getWeb3HttpProvider(networkID: number) {
    return Web3Connector.web3HttpProviders[networkID]
  }

  public static instantiateWsProvider(networkID: number, rpcURL: string) {
    if (!Web3Connector.web3Providers[networkID]) {
      const web3 = new Web3()
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
          `Web3 connnected for network ${networkID} on ${rpcURL}!!`,
        )
      })
      eventProvider.on('error', () => {
        Web3Connector.logger.error(
          `Web3 connection error for network ${networkID}!`,
        )
      })
      eventProvider.on('end', () => {
        Web3Connector.logger.warn(
          `Web3 connection ended for network ${networkID}!`,
        )
      })

      eventProvider.on('close', () => {
        Web3Connector.logger.warn(
          `Web3 connection closed for network ${networkID}!`,
        )
      })

      web3.setProvider(eventProvider)

      this.web3Providers[networkID] = web3
    } else {
      Web3Connector.logger.log(
        `Web3 WS Provider connnected already for network ${networkID}!!`,
      )
    }
  }

  public static instantiateHttpProvider(networkID: number, rpcUrl: string) {
    if (!Web3Connector.web3HttpProviders[networkID]) {
      const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl))
      this.web3HttpProviders[networkID] = web3
    } else {
      Web3Connector.logger.log(
        `Web3 Http Provider connnected already for network ${networkID}!!`,
      )
    }
  }
}
