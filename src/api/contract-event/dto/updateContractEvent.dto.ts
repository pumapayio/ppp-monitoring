import { IsNotEmpty } from 'class-validator'
import { ContractEventSyncStatus } from '../contract-event-status'

export class UpdateContractEventDto {
  @IsNotEmpty()
  id: string
  eventName?: string
  topic?: string
  contractName?: string
  address?: string
  abi?: string
  networkId?: number
  syncStatus?: ContractEventSyncStatus
  syncHistorical?: boolean
  lastSyncedBlock?: number
  lastSyncedTxHash?: string
}
