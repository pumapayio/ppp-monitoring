import * as Faker from 'faker'
import { define } from 'typeorm-seeding'
import { ContractEvent } from '../../api/contract-event/contract-event.entity'

define(ContractEvent, (faker: typeof Faker) => {
  return new ContractEvent()
})
