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

# How to deploy your own backend of WTM

If you want to use Web Time Machine app saving and managing your own navigation data the best way to do it is to deploy your own backend and connect it to the extension. Next we detail the steps to do achieve this.

- [Fork WTM repository](#fork-wtm-repository)
- [Create a **Supabase** database](#create-a-supabase-database)
- [Deploy the backend instance on **Vercel**](#deploy-the-backend-instance-on-vercel)
- [Set the environment variables](#set-the-environment-variables)

### Fork WTM repository

Fork [this repository](https://github.com/webtimemachine/wtm2) in to your Github account so you can macke changes, deploy it on Vercel or contribute to the project.


## Create a Supabase database

The backend of WTM uses a PostgressDB, we recommend using Supabase. First you have to create an Account on [Supabase](https://supabase.com/) and create a new project.

After this, you will be able to get the DATABASE_URL and the DIRECT_URL for the next steps.

## Deploy the backend instance on Vercel

Signup into [Vercel](https://vercel.com/) with your Github account and then follow [this documentation](https://vercel.com/docs/getting-started-with-vercel/import) to deploy the forked repository. Note that after this you have to setup the environment variables in the Settings of the project.

## Set the environment variables

To run the project in a local environment create a .env file on the root of the project and follow the example on .env.example 

1. **PORT**:
    - Example: **`PORT=5000`**
    - Usage: Specifies the port where the web server will listen for incoming requests. For instance, in a Node.js application, you might configure the server to listen on port 5000 with **`app.listen(process.env.PORT || 5000);`**.
2. **BASE_URL**:
    - Example: **`BASE_URL='http://localhost:5000'`**
    - Usage: Defines the base URL of the application. This can be useful for generating absolute URLs within the application or for configuring external services to communicate with the application.
3. **DATABASE_URL**:
    - Example: **`DATABASE_URL='postgresql://postgres:***@localhost:5432/web-time-machine-db'`**
    - Usage: Contains the connection URL for the PostgreSQL database used by the application. It typically includes the username, password (hidden here), host, port, and database name.
4. **DIRECT_URL**:
    - Example: **`DIRECT_URL='postgresql://postgres:***@localhost:5432/web-time-machine-db'`**
    - Usage: Similar to DATABASE_URL, it holds the connection information for the PostgreSQL database.
5. **BCRYPT_SALT**:
    - Example: **`BCRYPT_SALT=10`**
    - Usage: Specifies the cost factor or salt value used in the Bcrypt hashing algorithm for securely hashing passwords. In this case, the salt value is "10".
6. **CRYPTO_SALT**:
    - Example: **`CRYPTO_SALT=1a9af5a9ebe7853`**
    - Usage: A salt value used in cryptographic operations to add entropy and enhance security.
7. **CRYPTO_KEY**:
    - Example: **`CRYPTO_KEY=4ff64f746022599`**
    - Usage: Contains a cryptographic key used for encryption or decryption operations.
8. **JWT_ACCESS_SECRET**:
    - Example: **`JWT_ACCESS_SECRET=d5e3719e-c66b-4504-9b10-6b5a4a678ffb`**
    - Usage: Secret key used to sign and verify JWT access tokens for user authentication.
9. **JWT_ACCESS_EXPIRATION**:
    - Example: **`JWT_ACCESS_EXPIRATION=1d`**
    - Usage: Specifies the expiration time for JWT access tokens. In this case, "1d" indicates a validity period of one day.
10. **JWT_REFRESH_SECRET**:
    - Example: **`JWT_REFRESH_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
    - Usage: Secret key used to sign and verify JWT refresh tokens, typically used for refreshing expired access tokens.
11. **JWT_REFRESH_EXPIRATION**:
    - Example: **`JWT_REFRESH_EXPIRATION=1d`**
    - Usage: Specifies the expiration time for JWT refresh tokens. In this case, "1d" indicates a validity period of one day.
12. **JWT_PARTIAL_SECRET**:
    - Example: **`JWT_PARTIAL_SECRET=0f0d7c71-f0a0-421f-a0c4-9152072281b5`**
    - Usage: It seems to be another secret key related to JWT, but its specific usage is not clear from the provided context.
