export default () => ({
  /*
  |--------------------------------------------------------------------------
  | Blockchain Configurations
  |--------------------------------------------------------------------------
  |
  | All the blockchain configuration goes here
  |
  */
  executorKey: process.env.EXECUTOR_PRIVATE_KEY || null,
  supportedNetworks: process.env.SUPPORTED_NETWORKS || '[80001]',
  blockScanThreshold: Number(process.env.BLOCK_SCAN_THRESHOLD) || 1000,
})
