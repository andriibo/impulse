## Getting Started

```
cp -n .env.example .env
cp -n docker-compose.override.example.yml docker-compose.override.yml
```

## Docker

```bash
# run a stack of services
$ docker-compose up --build -dV
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migration

```bash
# commands listed below are specified in the package.json
# create migration
$ npm run migration:create --name=Migration

# generate migration
$ npm run migration:generate --name=Migration

# run migrations
$ npm run migration:up

# revert migration
$ npm run migration:down
```

## Create new OAuth2 Client
```bash
$ npm run console:dev create-client -- -s application user
$ npm run console create-client -s application user
```

## API Documentation

```bash
{SCHEME}://{HOST}:{PORT}/api
{SCHEME}://{HOST}:{PORT}/api-json
```

## pgAdmin

```bash
{SCHEME}://{HOST}:{PORT}/browser
1. login credentials: PGADMIN_DEFAULT_EMAIL and PGADMIN_DEFAULT_PASSWORD
2. create server
  Host: db.postgres
  Port: 5432
  Username: DB_USERNAME
  Password: DB_PASSWORD
```
