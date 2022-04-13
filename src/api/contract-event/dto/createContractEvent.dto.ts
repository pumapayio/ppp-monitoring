import { IsNotEmpty } from 'class-validator'
import { ContractEventSyncStatus } from '../contract-event-status'

export class CreateContractEventDto {
  @IsNotEmpty()
  eventName: string

  @IsNotEmpty()
  topic: string

  @IsNotEmpty()
  contractName: string

  @IsNotEmpty()
  address: string

  @IsNotEmpty()
  abi: string

  @IsNotEmpty()
  networkId: string

  @IsNotEmpty()
  syncStatus: ContractEventSyncStatus

  @IsNotEmpty()
  syncHistorical: boolean

  @IsNotEmpty()
  lastSyncedBlock: number

  lastSyncedTxHash: string
}
