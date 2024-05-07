# WebTM ![WTM  Website](https://cronitor.io/badges/CbeIhd/production/7FN5-J8hdv7hTI7zSN0Yyc6TBw0.svg) ![WTM  API](https://cronitor.io/badges/DOrpsj/production/0PbZKWShlq8iS_6_sPowwKHxKVI.svg)<img align="right" width="100" height="100" src="./app/public/app-icon.png">

Web Time Machine is a cross-platform solution built using React, Vite, and TypeScript to integrate the navigation history between desktop and mobile web browsers. Focusing on providing a solution for an integration between Google Chrome, Safari, Firefox, Android and iOS. This repository implements the backend solution with a NestJS application that provides a REST API and a PostgreSQL database used through PrismaORM.

## Installation

```bash
npm run app:install
npm run backend:install
```

<br/>

## Running with Docker

If you are pointing to your local database, you can use Docker Compose inside the backend folder to run the application. Before running the command, ensure that you have Docker and Docker compose installed on your system. You can download and install Docker Desktop from [here](https://www.docker.com/products/docker-desktop/).
Execute the following command in your terminal:

```bash
cd backend
docker compose up
```

Also you can run the ngrok to get a public access to your API. That's so useful when you are debugging on from any device regardless your local network. For that, do:

1. Visit the [Ngrok website](https://ngrok.com/) and sign up for an account.
2. After signing up, navigate to the dashboard to obtain your authentication token and domain

<br/>

## Set the backend environment variables

Copy the `sample.env` to `.env` and `sample.db.env` to `db.env` on the backend folder and edit the values if necessary.

### Env Variables:

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
14. **OPENAI_ACCESS_TOKEN**: To obtain a token, first, you need to create an account [here](https://auth0.openai.com/u/signup/identifier?state=hKFo2SBMLTJkWUFpa2dVWlBrTDdrTjdxbEp2ZGt6RmZBakdvbKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIEhleHE1SGYzQkdpMjhDM3d3dnFVZERmamF6TVpTMEpGo2NpZNkgRFJpdnNubTJNdTQyVDNLT3BxZHR3QjNOWXZpSFl6d0Q). Then, you can generate and get the access token [here](https://platform.openai.com/account/api-keys)
    - Example: **`OPENAI_ACCESS_TOKEN=sk-70s0d030f0thg043whsGsjBNV62skUiFz1LoPMm34BtrEs1I`**
    - Usage: Access token to use OpenAI's models.
15. **WEAVIATE_SCHEME**:
    - Example: **`WEAVIATE_SCHEME=http`**
    - Usage: Specifies the scheme the vector store is using.
16. **WEAVIATE_HOST**:
    - Example: **`WEAVIATE_HOST=localhost:8080`**
    - Usage: Specifies the vector store host.

You will also need to set this env variables as secrets on your GitHub repository for the db migrations GitHub action to work properly.

<br/>

## Running the backend

```bash
# development
npm run backend:dev

# production mode
npm run backend:prod
```

## Open API Docs

To see the Open API Specification navigate to / of your API running on the port you have enter in the .env. Ex: [http://localhost:5000/](http://localhost:5000/)

<br/>

## Deploy WTM backend on Vercel

Deploy [this repository](https://github.com/webtimemachine/wtm2) into your vercel account using the following button. After the deploy is complete you will need to go to the project settings and change the root folder to `backend` and also set the env variables.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwebtimemachine%2Fwtm2)

<br/>

## Create a Vercel Postgres Serverless SQL

The backend of WTM uses a PostgressDB, we recommend using Vercel Postgres. In order to do that you need to go to your Vercel dashboard on the tab 'Storage' and create a new DB. Then you need to setup the connection with your app, open the Advanced Options an set `DATABASE` as the envaronment variables prefix. After doing that, you can do to the env variables of you project and get the DATABASE_URL and DATABASE_URL_NON_POOLING to use on your local, connect to the database using an SQL client like [DBeaver](https://dbeaver.io/) and update your repository secrets.

![db-connect-project](./docs/db-connect-project.png)

<br/>

## Build the Extension

```bash
npm run app:install
npm run app:build
```

As a result you will found the built folders for chrome and firefox at the root folder on `app_chrome` and `app_firefox`

<br/>

## Install the extension in Chrome (using the .zip file or the extension folder)

- Click on the **Settings** icon located in the top-right corner of your Chrome browser. It resembles three vertically aligned dots, also known as the 'hamburger' icon.

- From the dropdown menu, hover over the **Tools** option, then select **Extensions**.

- Navigate to the location of the .zip file you wish to install. Unzip it where you want to let it installed (Desktop, for example). Keep in mind that if you want to use your local code, don't do anything.

- Click on the **Load unpacked** button located in the top-left corner of the screen. This action opens a file selection dialog.

- Select the folder where you had unziped or select the folder where your extension code is in local and click on the **Open** button. Chrome will begin installing the extension.

- Once completed, you'll see a notification confirming the successful installation. The extension should now be visible in your list of installed extensions.

Created by ttt246
