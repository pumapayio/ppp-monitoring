#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Drops existing DB
yarn schema:drop
# Delete all existing migrations 
rm  -f ./src/database/migrations/*.ts
# Re-create migrations
yarn migrate:generate initial -p true
# Run the migrations
yarn migrate:run
# Run the seeds
yarn seed:run