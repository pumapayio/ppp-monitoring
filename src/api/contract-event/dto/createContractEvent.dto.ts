import { IsNotEmpty } from 'class-validator'

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
  networkId: number

  @IsNotEmpty()
  lastSyncedBlock: number

  @IsNotEmpty()
  isSyncing: boolean

  @IsNotEmpty()
  syncHistorical: boolean
}
