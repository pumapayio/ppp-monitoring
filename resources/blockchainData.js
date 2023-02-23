const testnetEvents = require('./test-blockchain-events.json')
const mainnetEvents = require('./blockchain-events.json')

const blockchainEventsData = {
  80001: testnetEvents,
  137: mainnetEvents,
}

module.exports = { blockchainEventsData }
