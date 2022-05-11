import { Exclude, Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

@Exclude()
export class APIInformationDto {
  @Expose()
  @ApiProperty({ example: 'ppp-executor-node' })
  readonly name: string

  @Expose()
  @ApiProperty({ example: 'PPP Executor Node API' })
  readonly title: string

  @Expose()
  @ApiProperty({ example: 'Pull Payment Protocol V3.0 Executor Node' })
  readonly description: string

  @Expose()
  @ApiProperty({ example: '0.0.0' })
  readonly version: string

  @Expose()
  @ApiProperty({ example: 'http://localhost:3000' })
  readonly url: string
}
