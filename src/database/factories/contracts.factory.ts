import * as Faker from 'faker'
import { Contract } from '../../api/contract/contract.entity'
import { define } from 'typeorm-seeding'

define(Contract, (faker: typeof Faker) => {
  return new Contract()
})
