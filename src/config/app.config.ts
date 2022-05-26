export default () => ({
  /*
  |--------------------------------------------------------------------------
  | Application Meta Data
  |--------------------------------------------------------------------------
  |
  | This values are defined in the package.json.
  |
  */
  name: require('../../package.json').name,
  title: require('../../package.json').title,
  description: require('../../package.json').description,
  version: require('../../package.json').version,

  /*
  |--------------------------------------------------------------------------
  | App URL
  |--------------------------------------------------------------------------
  |
  | This value defines the url to our web client.
  |
  */
  appUrl:
    process.env.APP_URL ||
    `http://localhost:${parseInt(process.env.PORT, 10) || 3333}`,

  /*
  |--------------------------------------------------------------------------
  | Operation Mode
  |--------------------------------------------------------------------------
  |
  | This value defines the operation mode of the executor node.
  | There are 4 modes supported that eventually will be supported:
  |   - Executor              =>  Monitor all the blockchain events and trigger executions
  |   - Monitoring            =>  Monitor all the blockchain events but no executions
  |   - MerchantNotification  =>  Monitors blockchain events for a specific set of
  |                               addresses and triggers executions only for those
  |   - MerchantMonitoring    => Monitors blockchain events for a specific set of
  |                               addresses but does NOT trigger any executions
  | Currently Supporting: [Executor , Monitoring, MerchantMonitor, MerchantNotification]
  |
  */
  operationMode: process.env.OPERATION_MODE || 'Monitoring',

  /*
  |--------------------------------------------------------------------------
  | Monitoring Addresses
  |--------------------------------------------------------------------------
  |
  | This is a list of addresses to be monitored in case of MerchantNotification
  | or MerchantMonitoring mode
  |
  */
  monitoringAddresses: process.env.MONITORING_ADDRESSES || [],

  /*
  |--------------------------------------------------------------------------
  | API Key
  |--------------------------------------------------------------------------
  |
  | This is a api key that the executor node will use to call the api url
  | provided by merchant
  */
  apiURL: process.env.API_URL || null,

  /*
  |--------------------------------------------------------------------------
  | Request Header Key
  |--------------------------------------------------------------------------
  |
  | This the http request header key which is used to authenticate the request
  | on merchant side
  | Examples:
  | - Access-Token
  | - Authorization
  |
  */
  requestHeaderKey: process.env.REQUEST_HEADER_KEY || null,

  /*
  |--------------------------------------------------------------------------
  | Request Header Value
  |--------------------------------------------------------------------------
  |
  | This is the value used for the request header key specified above and is
  | used to eventually authenticate the request on merchant side
  */
  requestHeaderValue: process.env.REQUEST_HEADER_VALUE || null,

  /*
  |--------------------------------------------------------------------------
  | Application Port
  |--------------------------------------------------------------------------
  |
  | This value define on witch port the application is available. Default is
  | the standard port 8080
  |
  */

  port: parseInt(process.env.PORT, 10) || 3333,

  /*
  |--------------------------------------------------------------------------
  | Client URL
  |--------------------------------------------------------------------------
  |
  | This value defines the url to our web client.
  |
  */
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080/tournament',

  /*
  |--------------------------------------------------------------------------
  | Scheduler Interval
  |--------------------------------------------------------------------------
  |
  | This value defines how often we scan our DB for upcoming pull payment executions
  | Default Value is every 5 minutes (300 seconds)
  | WARNING: schedulerInterval must be in line with process.env.SCHEDULER_CRON_EXPRESSION
  |
  */
  schedulerInterval: process.env.SCHEDULER_INTERVAL_IN_SEC || 300, // 5 mins
})
