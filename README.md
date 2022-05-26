# Executor Node - PPP v3.0

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)


## Description

This app monitors, stores and trigger the execution of pull payments

## Installation

### Pre-requisites

- [NodeJS](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
- [Docker](https://docs.docker.com/desktop/)
- [Docker Comppose](https://docs.docker.com/compose/install/)

We recommend using [Homebrew](https://brew.sh/index_de) on your MAC or [choco](https://chocolatey.org/install) on windows.

Now we can install our dependencies with the following command.

```bash
$ yarn install
```

### Create your .ENV file

Copy the `.env.examle` and rename it to `.env`. In this file collects all the global configurations.

### Database setup

We have set up the local DB using docker-compose to make it easier

```bash
# starts the docker image and have it running in the background (-d)
$ docker-compose up -d postgres
```

## Running the app - YARN

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Running the app - Docker

```bash
# builds the docker image
$ docker-compose build

# starts the app
$ docker-compose up -d

# print logs of  the app
$ docker-compose logs -f executor-node
```

## Testing the app

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

NOTE: The app currently doesn't have any tests
