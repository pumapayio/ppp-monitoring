export default () => ({
  /*
  |--------------------------------------------------------------------------
  | Blockchain Configurations
  |--------------------------------------------------------------------------
  |
  | All the blockchain configuration goes here
  |
  */

  supportedNetworks: process.env.SUPPORTED_NETWORKS || '[97]',
  monitorMode: process.env.MONITOR_MODE || 'all',
})
