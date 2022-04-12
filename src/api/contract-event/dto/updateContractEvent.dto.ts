import { IsNotEmpty } from 'class-validator'

export class UpdateContractEventDto {
  @IsNotEmpty()
  id: string
  eventName?: string
  topic?: string
  contractName?: string
  address?: string
  abi?: string
  networkId?: number
  lastSyncedBlock?: number
  isSyncing?: boolean
  syncHistorical?: boolean
}
