import {
  serializeBMSubscription,
  UnserializedBMSubscription,
} from './bm-subscription.serializer'
import BigNumber from 'bignumber.js'

const assessSerialization = (
  billingModelId,
  bmSubscriptionId,
  contractAddress,
  networkId,
  unserializedBMSubscription,
) => {
  const serialized = serializeBMSubscription(
    billingModelId,
    bmSubscriptionId,
    contractAddress,
    networkId,
    unserializedBMSubscription,
  )

  expect(serialized.billingModelId).toEqual(
    unserializedBMSubscription.billingModelID,
  )
  expect(serialized.subscriber).toEqual(unserializedBMSubscription.subscriber)
  expect(serialized.paymentAmount).toEqual(
    String(unserializedBMSubscription.amount),
  )
  expect(serialized.uniqueReference).toEqual(
    unserializedBMSubscription.uniqueReference,
  )
  expect(serialized.token).toEqual(unserializedBMSubscription.settlementToken)
  expect(serialized.paymentToken).toEqual(
    unserializedBMSubscription.paymentToken,
  )
  expect(serialized.remainingNumberOfPayments).toEqual(
    unserializedBMSubscription.numberOfPayments,
  )
  expect(serialized.startTimestamp).toEqual(
    unserializedBMSubscription.startTimestamp,
  )
  expect(serialized.cancelTimestamp).toEqual(
    unserializedBMSubscription.cancelTimestamp,
  )
  expect(serialized.cancelledBy).toEqual(unserializedBMSubscription.cancelledBy)
  expect(serialized.nextPaymentTimestamp).toEqual(
    unserializedBMSubscription.nextPaymentTimestamp,
  )
  expect(serialized.lastPaymentTimestamp).toEqual(
    unserializedBMSubscription.lastPaymentTimestamp,
  )
  expect(serialized.pullPaymentIDs).toEqual(
    unserializedBMSubscription.pullPaymentIDs,
  )

  return serialized
}

describe('Billing Model Serializer', () => {
  it('should be able to serialize subscriptions for non dynamic bms', () => {
    const billingModelId = '1'
    const bmSubscriptionId = '1'
    const contractAddress = '0x'
    const networkId = '97'
    const unserializedBMSubscription: UnserializedBMSubscription = {
      billingModelID: billingModelId,
      subscriber: '0x123123123',
      amount: new BigNumber('1'),
      uniqueReference: 'uniqueRef',
      settlementToken: '0x',
      paymentToken: '0x',
      numberOfPayments: '10',
      startTimestamp: '',
      cancelTimestamp: '0',
      cancelledBy: '0x',
      nextPaymentTimestamp: '0',
      lastPaymentTimestamp: '0',
      pullPaymentIDs: ['1', '2'],
    }

    const serialized = assessSerialization(
      billingModelId,
      bmSubscriptionId,
      contractAddress,
      networkId,
      unserializedBMSubscription,
    )
    expect(serialized.paymentAmount).toEqual(
      String(unserializedBMSubscription.amount),
    )
    expect(serialized.remainingNumberOfPayments).toEqual(
      unserializedBMSubscription.numberOfPayments,
    )
  })

  it('should be able to serialize subscriptions for dynamic bms', () => {
    const billingModelId = '1'
    const bmSubscriptionId = '1'
    const contractAddress = '0x'
    const networkId = '97'
    const unserializedBMSubscription: UnserializedBMSubscription = {
      billingModelID: billingModelId,
      subscriber: '0x123123123',
      paymentAmount: new BigNumber('10'),
      uniqueReference: '',
      settlementToken: '0x',
      paymentToken: '0x',
      remainingPayments: '5',
      startTimestamp: '',
      cancelTimestamp: '0',
      cancelledBy: '0x',
      nextPaymentTimestamp: '0',
      lastPaymentTimestamp: '0',
      pullPaymentIDs: [],
    }

    const serialized = assessSerialization(
      billingModelId,
      bmSubscriptionId,
      contractAddress,
      networkId,
      unserializedBMSubscription,
    )

    expect(serialized.paymentAmount).toEqual(
      String(unserializedBMSubscription.paymentAmount),
    )
    expect(serialized.remainingNumberOfPayments).toEqual(
      unserializedBMSubscription.remainingPayments,
    )
  })
})
