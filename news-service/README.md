# News Service

## Description

News service is cron-based application that syncs news from different websites, translates them to russian/ukranian and stores it in a mongo database

## Environment
Required environment variables
```bash
NODE_ENV

MONGODB_HOST
MONGODB_PORT
MONGODB_STORAGE
MONGODB_USER
MONGODB_PASSWORD

APPLICATION_PORT
```

You can change them in the .env file

## How to run

1. Install dependencies with:

```bash
yarn install
```

2. Setup Postgres and PGAdmin containers by running a

```bash
docker-compose up -d
```

docker-compose will also setup some stock data for tables that's stored in init.sql file

3. Launch a typescript build watcher

```bash
yarn watch-ts // yarn tsc --watch
```

4. Start an application

```bash
yarn start
```

After performing those operations a server will start. A default port is 8082.

## Tests
To properly launch tests you need to bootstrap a postgres image from a docker-compose first

```bash
yarn test
```