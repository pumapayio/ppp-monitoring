import * as Faker from 'faker'
import { Contract } from '../../../src/api/contract/contract.entity'
import { define } from 'typeorm-seeding'

define(Contract, (faker: typeof Faker) => {
  const contract = new Contract()

  return contract
})
