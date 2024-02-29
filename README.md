# Web Time Machine

Web Time Machine is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers. Focusing on providing a solution for an integration between Google Chrome, Safari, Firefox, Android and iOS. This repository implements the backend solution with a NestJS application that provides a REST API and a PostgreSQL database used through PrismaORM.

## Installation

```bash
$ npm install
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

## Open API Docs

To see the Opne API Specification navigate to /

# How to deploy your own Backend of WTM

If you want to use Web Time Machine app saving and managing your own navigation data the best way to do it is to deploy your own backend and connect it to the extension. Next we detail the steps to do achieve this.

- [Deploy WTM on Vercel](#deploy-wtm-on-vercel)
- [Create a Vercel Postgres Serverless SQL](#create-a-vercel-postgres-serverless-sql)
- [Set the environment variables](#set-the-environment-variables)

### Deploy WTM on Vercel

Deploy [this repository](https://github.com/webtimemachine/wtm2) into your vercel account using the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwebtimemachine%2Fwtm2)

## Create a Vercel Postgres Serverless SQL

The backend of WTM uses a PostgressDB, we recommend using Vercel Postgres. In order to do that you need to go to your Vercel dashboard on the tab 'Storage' and create a new DB. Then you need to setup the connection with your app, open the Advanced Options an set `DATABASE` as the envaronment variables prefix. After that you can do to the env variables of you project and get the DATABASE_URL to use on your local, connect to the database using an SQL client like [DBeaver](https://dbeaver.io/) and update your repository secrets.

![db-connect-project](./docs/db-connect-project.png)

## Set the environment variables

To run the project in a local environment create a .env file on the root of the project and follow the example on .env.example

1. **PORT**:
   - Example: **`PORT=5000`**
   - Usage: Specifies the port where the web server will listen for incoming requests. For instance, in a Node.js application, you might configure the server to listen on port 5000 with **`app.listen(process.env.PORT || 5000);`**.
2. **BASE_URL**:
   - Example: **`BASE_URL='http://localhost:5000'`**
   - Usage: Defines the base URL of the application. This can be useful for generating absolute URLs within the application or for configuring external services to communicate with the application.
3. **DATABASE_URL**:
   - Example: **`DATABASE_URL='postgres://default:\*\***\*\***\*\***@ep-little-**\*\*\***.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require'`\*\*
   - Usage: Contains the connection URL for the PostgreSQL database used by the application. It typically includes the username, password (hidden here), host, port, and database name.
4. **BCRYPT_SALT**:
   - Example: **`BCRYPT_SALT=10`**
   - Usage: Specifies the cost factor or salt value used in the Bcrypt hashing algorithm for securely hashing passwords. In this case, the salt value is "10".
5. **CRYPTO_SALT**:
   - Example: **`CRYPTO_SALT=1a9af5a9ebe7853`**
   - Usage: A salt value used in cryptographic operations to add entropy and enhance security.
6. **CRYPTO_KEY**:
   - Example: **`CRYPTO_KEY=4ff64f746022599`**
   - Usage: Contains a cryptographic key used for encryption or decryption operations.
7. **JWT_ACCESS_SECRET**:
   - Example: **`JWT_ACCESS_SECRET=d5e3719e-c66b-4504-9b10-6b5a4a678ffb`**
   - Usage: Secret key used to sign and verify JWT access tokens for user authentication.
8. **JWT_ACCESS_EXPIRATION**:
   - Example: **`JWT_ACCESS_EXPIRATION=1d`**
   - Usage: Specifies the expiration time for JWT access tokens. In this case, "1d" indicates a validity period of one day.
9. **JWT_REFRESH_SECRET**:
   - Example: **`JWT_REFRESH_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
   - Usage: Secret key used to sign and verify JWT refresh tokens, typically used for refreshing expired access tokens.
10. **JWT_REFRESH_EXPIRATION**:
    - Example: **`JWT_REFRESH_EXPIRATION=1d`**
    - Usage: Specifies the expiration time for JWT refresh tokens. In this case, "1d" indicates a validity period of one day.
11. **JWT_PARTIAL_SECRET**:
    - Example: **`JWT_PARTIAL_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
    - Usage: It seems to be another secret key related to JWT, but its specific usage is not clear from the provided context.

You will also need to set this env variables as secrets on your GitHub repository for the db migrations GitHub action to work properly.
