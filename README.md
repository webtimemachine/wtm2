# Web Time Machine

Web Time Machine is a cross-platform solution to integrate the navigation history between desktop and mobile web browsers. Focusing on providing a solution for an integration between Google Chrome, Safari, Firefox, Android and iOS. This repository implements the backend solution with a NestJS application that provides a REST API and a PostgreSQL database used through PrismaORM.

## Installation

```bash
$ npm install
```

Copy the `sample.env` to `.env` and edit the values if necessary. Please watch the [Set the environment variables](#set-the-environment-variables).

## Running with Docker

If you are pointing to your local database, you can use Docker Compose to run the application. Before running the command, ensure that you have Docker and Docker compose installed on your system. You can download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).
Execute the following command in your terminal:

```bash
docker compose up
```

Also you can run the ngrok to get a public access to your API. That's so useful when you are debugging on from any device regardless your local network. For that, do:

1. Visit the [Ngrok website](https://ngrok.com/) and sign up for an account.
2. After signing up, navigate to the dashboard to obtain your authentication token and domain
3. Run the following command:

```
docker run --net=host -it -e NGROK_AUTHTOKEN=2L3OvbfDz... ngrok/ngrok:latest http --domain=youronwdomain.ngrok-free.app API_PORT
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

To see the Open API Specification navigate to / of your API running on the port you have enter in the .env. Ex: [http://localhost:5000/](http://localhost:5000/)

# How to deploy your own Backend of WTM

If you want to use Web Time Machine app saving and managing your own navigation data the best way to do it is to deploy your own backend and connect it to the extension. Next we detail the steps to do achieve this.

- [Web Time Machine](#web-time-machine)
  - [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Open API Docs](#open-api-docs)
- [How to deploy your own Backend of WTM](#how-to-deploy-your-own-backend-of-wtm)
  - [Deploy WTM on Vercel](#deploy-wtm-on-vercel)
  - [Create a Vercel Postgres Serverless SQL](#create-a-vercel-postgres-serverless-sql)
  - [Set the environment variables](#set-the-environment-variables)
- [Chrome Extension](#chrome-extension)
  - [How to run it locally](#how-to-run-it-locally)

### Deploy WTM on Vercel

Deploy [this repository](https://github.com/webtimemachine/wtm2) into your vercel account using the following button.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwebtimemachine%2Fwtm2)

## Create a Vercel Postgres Serverless SQL

The backend of WTM uses a PostgressDB, we recommend using Vercel Postgres. In order to do that you need to go to your Vercel dashboard on the tab 'Storage' and create a new DB. Then you need to setup the connection with your app, open the Advanced Options an set `DATABASE` as the envaronment variables prefix. After doing that, you can do to the env variables of you project and get the DATABASE_URL and DATABASE_URL_NON_POOLING to use on your local, connect to the database using an SQL client like [DBeaver](https://dbeaver.io/) and update your repository secrets.

![db-connect-project](./docs/db-connect-project.png)

## Set the environment variables

To run the project in a local environment create a .env file on the root of the project and follow the example on sample.env

1. **PORT**:
   - Example: **`PORT=5000`**
   - Usage: Specifies the port where the web server will listen for incoming requests. For instance, in a Node.js application, you might configure the server to listen on port 5000 with **`app.listen(process.env.PORT || 5000);`**.
2. **BASE_URL**:
   - Example: **`BASE_URL='http://localhost:5000'`**
   - Usage: Defines the base URL of the application. This can be useful for generating absolute URLs within the application or for configuring external services to communicate with the application.
3. **DATABASE_URL**:
   - Example: \*\*`DATABASE_URL='postgres://myuser:mypassword@localhost:5433/web-time-machine'`\*\*
   - Usage: Contains the connection URL for the PostgreSQL database used by the application. It typically includes the username, password (hidden here), host, port, and database name.
4. **DATABASE_URL_NON_POOLING**:
   - Example: \*\*`DATABASE_URL_NON_POOLING='postgres://myuser:mypassword@localhost:5433/web-time-machine'`\*\*
   - Usage: Contains the connection URL for the PostgreSQL database used by the migrations. It typically includes the username, password (hidden here), host, port, and database name.
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
13. **EMAIL_URI**:
    - Example: **`EMAIL_URI='smtps://mail@gmail.com:password@smtp.gmail.com'`**
    - Usage: SMTP mailer.
13. **OPENAI_ACCESS_TOKEN**: To obtain a token, first, you need to create an account [here](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBMLTJkWUFpa2dVWlBrTDdrTjdxbEp2ZGt6RmZBakdvbKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEhleHE1SGYzQkdpMjhDM3d3dnFVZERmamF6TVpTMEpGo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q). Then, you can generate and get the access token [here](https://platform.openai.com/account/api-keys)
    - Example: **`OPENAI_ACCESS_TOKEN=sk-70s0d030f0thg043whsGsjBNV62skUiFz1LoPMm34BtrEs1I`**
    - Usage: Access token to use OpenAI's models.
14. **WEAVIATE_SCHEME**:
    - Example: **`WEAVIATE_SCHEME=http`**
    - Usage: Specifies the scheme the vector store is using.
15. **WEAVIATE_HOST**:
    - Example: **`WEAVIATE_HOST=localhost:8080`**
    - Usage: Specifies the vector store host.
13. **OPENAI_ACCESS_TOKEN**:
    - Example: **`OPENAI_ACCESS_TOKEN=sk-70s0d030f0thg043whsGsjBNV62skUiFz1LoPMm34BtrEs1I`**
    - Usage: Access token to use OpenAI's models.
14. **WEAVIATE_SCHEME**:
    - Example: **`WEAVIATE_SCHEME=http`**
    - Usage: Specifies the scheme the vector store is using.
15. **WEAVIATE_HOST**:
    - Example: **`WEAVIATE_HOST=localhost:8080`**
    - Usage: Specifies the vector store host.

You will also need to set this env variables as secrets on your GitHub repository for the db migrations GitHub action to work properly.

# Chrome Extension

## Install the extension in Chrome (using the .zip file or the extension folder)

- Click on the **Settings** icon located in the top-right corner of your Chrome browser. It resembles three vertically aligned dots, also known as the 'hamburger' icon.

- From the dropdown menu, hover over the **Tools** option, then select **Extensions**.

- Navigate to the location of the .zip file you wish to install. Unzip it where you want to let it installed (Desktop, for example). Keep in mind that if you want to use your local code, don't do anything.

- Click on the **Load unpacked** button located in the top-left corner of the screen. This action opens a file selection dialog.

- Select the folder where you had unziped or select the folder where your extension code is in local and click on the **Open** button. Chrome will begin installing the extension.

- Once completed, you'll see a notification confirming the successful installation. The extension should now be visible in your list of installed extensions.

- This step only applies if you want to change the API URL. In local extension folder: [const.js](./extensions/Chrome%20Web/consts.js) is the file where you can change the API environment. Remember that every time you change the code, you should go to **Extensions** in your browser and then click in update.
