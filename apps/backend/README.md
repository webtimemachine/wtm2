# WebTM Backend

This is the backend service for the Web Time Machine project (WebTM), an open-source cross-platform web browser extension compatible with Chrome, Firefox, Safari, Safari iOS, and Firefox Android. The backend is built using [NestJS](https://nestjs.com/) and serves as the REST API provider that communicates with the browser extension, processes data, and integrates with AI-based services.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [Docker Compose Setup](#docker-compose-setup)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Deployment](#deployment)

## Overview

The backend is responsible for handling user data, sessions, devices, preferences, and navigation entries. It uses a PostgreSQL database (managed via [Prisma ORM](https://www.prisma.io/)) to persist data and integrates with [OpenAI](https://openai.com/).

## Features

- **User and Session Management**: Manage user accounts, sessions, and preferences.
- **Navigation History Tracking**: Receive and store user navigation history from the browser extension.
- **AI Integration**:
  - **Semantic Search**: Search through navigation entries using OpenAI's model.
  - **Explicit Content Filtering**: Automatically filter out navigation entries with explicit content using ChatGPT if the "Explicit Filter" preference is enabled.
- **REST API Documentation**: Available through Swagger at `/`.

## Prerequisites

- **Node.js**: Version 20 is required. Ensure your environment is set up accordingly.
- **Docker**: For local development and running dependencies (PostgreSQL).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/webtimemachine/wtm2.git
   cd wtm2/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

## Running the Application

To start the application in development mode:

```bash
npm run start:dev
```

For production:

```bash
npm run build
npm run start:prod
```

## Environment Variables

Create a `.env` file in the `backend` folder and configure the following environment variables:

```dotenv
PORT='5001'
BASE_URL='http://localhost:5001'

DATABASE_URL='postgres://postgres:postgres@localhost:5432/web-time-machine-db'
BCRYPT_SALT='10'
CRYPTO_SALT='1a9af5a9ebe7853'
CRYPTO_KEY='4ff64f746022599'

.
.
.

OPENAI_ACCESS_TOKEN='your-openai-access-token'
EMAIL_URI='smtps://user:password@smtp.gmail.com'
SENTRY_DSN='your-sentry-dsn'
```

Replace placeholders with your actual configuration. <br/>
To see the full configuration file with all the variables and explanation, look at this guide: [Backend Environment Variables](/guides/setup-backend-environment-variables.md)

## Docker Compose Setup

For development purposes, you can use the `docker-compose.yml` file provided in the repository to spin up the required PostgreSQL database locally.

To start the services, run:

```bash
docker compose up
```

This will start:

- **PostgreSQL**: For storing user data, sessions, and navigation entries.

## Database Migrations

To apply database migrations using Prisma, run:

```bash
npm run migrate
```

To create a new migration:

```bash
npm run migrate:create --name migration_name
```

## Testing

The project uses [Jest](https://jestjs.io/) for testing. To run the tests:

```bash
npm test
```

This command will run all the tests defined in the project.

## Deployment

The backend is deployed on Vercel, utilizing Vercel Postgres for production environments. Ensure your environment variables are properly set up in the production environment.

### Deploy WebTM backend on Vercel

Deploy [this repository](https://github.com/webtimemachine/wtm2) into your vercel account using the following button. After the deploy is complete you will need to go to the project settings and change the root folder to `backend` and also set the env variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwebtimemachine%2Fwtm2)

<br/>

### Create a Vercel Postgres Serverless SQL

The backend of WebTM uses a PostgressDB, we recommend using Vercel Postgres. In order to do that you need to go to your Vercel dashboard on the tab 'Storage' and create a new DB. Then you need to setup the connection with your app, open the Advanced Options an set `DATABASE` as the envaronment variables prefix. After doing that, you can do to the env variables of you project and get the DATABASE_URL and DATABASE_URL_NON_POOLING to use on your local, connect to the database using an SQL client like [DBeaver](https://dbeaver.io/) and update your repository secrets.

![db-connect-project](../docs/db-connect-project.png)
