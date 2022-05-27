# PumaPay Monitoring Service - PPP v3.0
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Intro
The PumaPay Monitoring Service is an open source project, which monitors and store the following events of the 
PumaPay Pull Payment Protocol v3.0:

- Billing Model Creation
- Edit of Billing Model
- Subscriptions to Billing Models
- Pull Payment Executions for Subscriptions
- Cancellation of Subscriptions

This service is indented to be used by the merchants in order to get notified whenever a new subscription or 
payment has occurred on the blockchain and take action accordingly. For example, whenever there is a new subscription
as a merchant you would want to allow access of your services to the new subscriber. The same applies on a recurring 
payment, when a customer pays you need to renew their subscription and still allow him to access your services. 

The merchant is expected to run this software on their end and not having to depend on a 3rd party for the 
notification and allowance of services to their customer.

The merchant is able to configure this monitoring service in such a way that it will call an API to 
existing services so that their backend is aware of any payment / new subscription / cancellation.

> More details on the PumaPay Pull Payment Protocol v3.0 can be found [here](). 

## Operation Modes 
This service can operate in 4 different modes at the moment:

1. Monitoring - `Monitoring`
This operation mode monitors and stores all the blockchain events that are emitted from the protocol to a database.


2. Merchant Monitoring - `MerchantMonitoring`
This operation mode monitors and stores all the blockchain events that are emitted from the protocol to a database
but for a selected list of addresses that is specified through the [configs](#merchant-monitoring-configs).

> Each event emitted from the blockchain has a `payee` attribute and we are checking if that value is part of the list 
> specified through the configurations.


4. Merchant Notification - `MerchantNotification`
This mode extends the merchant monitoring mode with the additional feature of sending a notification through an API
to an endpoint specified from the merchant through the [configs](#merchant-notification-configs). Details on the 
notifications that are sent to the API can be found [here](#notifications).


5. Executor - `Executor`
This mode extends the monitoring mode, i.e. monitors all the blockchain events and stores them in a database. On top 
of that there is a scheduled job (default is every 5'), which checks the DB for all the subscriptions that their
next payment time is in the past and triggers its execution. A wallet address with funds is necessary to operate this 
mode and special permissions must be given to that address on the protocol level (smart contracts).

> More details on this in the future! Keep an eye on our [blog](https://pumapay.io/blog)!

## Configurations

Example configuration file can be found in `.env.examle`. 

### General Configs
The below env variables are needed regardless of the operation mode.
```dotenv
################
## APP Config ##
################
PORT=3000 ## (optional) If not specified defaults to 3333
LOG_LEVELS=["log","error","warn","debug", "verbose"] ## (optional) if not specified defaults to all

OPERATION_MODE=Monitoring ## defaults to Monitoring if not specified

#######################
## Blockchain Config ##
#######################
SUPPORTED_NETWORKS=[97] ## list of network ids the service monitors (currently supporting 56 and 97) 
BLOCK_SCAN_THRESHOLD=1000 ## number of blocks to check at a time during syncing

#######################
### Database Config ###
#######################
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=copa
DB_LOGGING=false
DB_SYNCHRONIZE=false
DB_DROP_SCHEMA=false
DB_MIGRATIONS_RUN=false
```

> NOTE: All the DB Configurations are based on [NestJS](https://docs.nestjs.com/techniques/database) and [TypeORM](https://typeorm.io/data-source-options)

### Merchant Monitoring Configs
The below configs is an extension of the general config

```dotenv
OPERATION_MODE=MerchantMonitoring
## List of addresses that the service will monitor events for 
MONITORING_ADDRESSES=["0x123123...123123","0xabcabc....abcabc"]
```

### Merchant Notification Configs
The below configs is an extension of the general config

```dotenv
OPERATION_MODE=MerchantMNotification
## List of addresses that the service will monitor events for 
MONITORING_ADDRESSES=["0x123123...123123","0xabcabc....abcabc"]
## URL that is called on each event 
API_URL="https://backend_url_of_merchant.com/api/"
## Request header congiruation - to be used for auth purposes
## Example: {"x-access-token" : "xxxxx"} 
REQUEST_HEADER_KEY="x-access-token"
REQUEST_HEADER_VALUE="xxxxx"
```

## Notifications

Below are the notification payload that is being sent to the API specified through the configs. 

> NOTE: Depending on the billing model type, some attributes in the notification payloads below will be null

### Billing Model Created / Edited 
On every billing model creation and edit, we send the billing model details to the merchant.

```json
{
  "eventType": "BillingModelCreated", // OR BillingModelEdited
  "payload":  {
    "billingModelId": "2",
    "contractAddress": "0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba",
    "networkId": "97",
    "payee": "0x8d165d6A2070417d4a13E9F8d19d865fA1ce16f1",
    "subscriptionIDs": [],
    "blockCreationTime": "1653472538", // timestamp in seconds
    "uniqueReference": "RecurringPullPayment_2", 
    "merchantName": "PumaPay Dev",
    "merchantURL": "https://pumapay.io",
    "name": "Monthly Silver Package 1000 USDT",
    "amount": "1000000000000000000000", // based on token decimals
    "settlementToken": "0x9a881b8363995EEF5f0FA6C430625dCb39d31224",
    "sellingToken": "0x9a881b8363995EEF5f0FA6C430625dCb39d31224",
    "numberOfPayments": "7",
    "frequency": "259200", // in seconds
    "trialPeriod": "3600", // in seconds
    "initialAmount": "100000000000000000000", // based on token decimals
    "id": "uuid"
  }
}
```

### New Billing Model Subscription / Cancellation of Subscription
Whenever a new customer subscribes to one of the merchant's billing model we send the subscription and 
billing model details. Same applies when the customer or the merchant cancels a subscription.

```json
{
  "eventType": "NewSubscription", // OR SubscriptionCancelled
  "payload": {
    "billingModelId": "2",
    "bmSubscriptionId": "4",
    "networkId": "97",
    "contractAddress": "0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba",
    "uniqueReference": "RecurringPullPayment_2_4", 
    "subscriber": "0x841538828eDB80Ced944D272C3A899483Ac614d1",
    "paymentAmount": "10000000000000000000", // based on token decimals
    "settlementToken": "0x9a881b8363995EEF5f0FA6C430625dCb39d31224",
    "paymentToken": "0xc5d495EEaA84942095b769342bC71125721692Da",
    "token": "0x9a881b8363995EEF5f0FA6C430625dCb39d31224",
    "remainingNumberOfPayments": "6",
    "startTimestamp": "1653476114", // timestamp in seconds
    "cancelTimestamp": "0", // timestamp in seconds
    "cancelledBy": "0x0000000000000000000000000000000000000000",
    "nextPaymentTimestamp": "1653735314", // timestamp in seconds
    "lastPaymentTimestamp": "1653476114", // timestamp in seconds
    "pullPaymentIDs": [],
    "id": "uuid",
    "billingModel": {
      // ...............
      // Same as Billing Model Created / Edited object
      // ...............
    }
  }
}
```

### Pull Payment Execution

Whenever a new customer pays the merchant based on the billing model and subscription details we send the payment 
details, the subscription and the billing model details

```json
{
  "eventType": "PullPaymentExecuted",
  "payload": {
    "pullPaymentId": "4",
    "bmSubscriptionId": "4",
    "billingModelId": "2",
    "contractAddress": "0x1f6f3e75D26bC77811A47Eac8d91aF8F2530bBba",
    "networkId": "97",
    "paymentAmount": "20029740278573657000000", // based on token decimals
    "executionFeeAmount": "2002974027857365600000", // based on token decimals
    "receivingAmount": "9000127149729838000", // based on token decimals
    "executionTimestamp": "1653476114", // timestamp in seconds
    "transactionHash": "0x90ac50090fae21c17f2d14e52bf45bc8e953ac6aa9482ee29187171c4f5697a4",
    "id": "uuid",
    "bmSubscription": {
      // ...............
      // New Billing Model Subscription / Cancellation object
      // ...............      
      "billingModel": {
        // ...............
        // Same as Billing Model Created / Edited object
        // ...............
      }
    }
  }
}
```

## Development
Follow the steps below to setup the project for development purposes.

### Pre-requisites

- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Docker](https://docs.docker.com/desktop/)
- [Docker Comppose](https://docs.docker.com/compose/install/)

We recommend using [Homebrew](https://brew.sh/index_de) on your MAC or [choco](https://chocolatey.org/install) on Windows.

Now you can install the dependencies with the following command.

```bash
$ yarn install
```

### Create your .ENV file

Copy the `.env.examle` and rename it to `.env`. This file collects all the global configurations of the application. 
Check the [Configurations section](#configurations) for further details on the configuration of each operation mode.

### Database setup
#### Docker
We have set up the local DB using docker-compose to make it easier

```bash
# starts the docker image and have it running in the background (-d)
$ docker-compose up -d postgres
```

#### Local DB instance
You can also set up a local DB instance according to your preference. We suggest postgres, however any DB that is 
[TypeORM compatible](https://typeorm.io/#installation) should work with no issues. 

### Running the app - YARN

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Running the app - Docker

```bash
# builds the docker image
$ docker-compose build

# starts the app
$ docker-compose up -d

# print logs of the app
$ docker-compose logs -f executor-node
```

### Testing the app

The whole application has been manually tested extensively from the PumaPay Engineering team. 
Unit tests are still on the pipeline of the engineering team and everyone is welcome to add any unit tests.

```bash
# unit tests
$ yarn run test

# test coverage
$ yarn run test:cov
```
