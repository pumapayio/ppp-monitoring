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
