# Installation Walkthrough

## Extension instalation and development

- Clone the [WTM repository](https://github.com/webtimemachine/wtm2) with

```
  git clone git@github.com:webtimemachine/wtm2.git
```

- Set the correct node version using nvm and install the app dependencies

```
  nvm use
  npm run app:install
```

- Build the chrome extension or started it on watch mode with

```
  npm run app:build:chrome
  npm run app:watch:chrome
```

> after the build is complete you will find the folder `app_chrome` at the root of the respository

- Open the extensions page of Google Chrome under `chrome://extensions/`

  1. Enable `Developer mode`
  2. Click on the `Load unpacked` button to load the recently build extension
     - To load the extension navigate to the folder `app_chrome` and select it

- Now you should see the app install on you browser and you will le able to login to a cloud instance and start using the WTM

## Backend instalation and development

- Set the correct node version using nvm and install the backend dependencies

```
  nvm use
  npm run backend:install
```

- Create the `.env` and `db.env` files base on the sample env files

  - `db.env` will be use for the env vars of the postgres docker container setted up on `docker-compose-yml`
  - `.env` is the env file used on the local backend application

- Start the local docker containers using

```
  docker-compose -f "backend/docker-compose.yml" up -d
```

- Start you backend applicacion using

```
  npm run backend:dev
```

- Now you should be able to connect to your local backend using `http://localhost:<PORT>` as your server url

## Video Walkthrough

[![WTM Installation Walkthrough](https://img.youtube.com/vi/sGA4V-fGf4I/0.jpg)](https://www.youtube.com/watch?v=sGA4V-fGf4I)
