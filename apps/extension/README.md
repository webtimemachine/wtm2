# WebTM Browser Extension

WebTM is a cross-platform web browser extension that integrates the navigation history between desktop and mobile web browsers. This extension is built using React, TypeScript, Vite, and is compatible with Chrome, Firefox, Safari, Safari iOS, and Firefox Android.

## Table of Contents

- [Features](#featureså)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Testing](#testing)
- [Configuration](#configuration)

## Features

- **Cross-Platform Support**: Compatible with multiple browsers including Chrome and Firefox.
- **Technology Stack**: Built with React, TypeScript, Vite, and uses TanStack Query for efficient data fetching.
- **Browser-Specific Configuration**: Utilizes Vite configurations to match the output with the extension's manifest files.
- **Dynamic Manifest Generation**: Separate manifests for Chrome and Firefox to handle browser-specific settings and permissions.

## Installation

To install and run the WebTM extension locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your development machine:

- **Node.js v20**: Install Node.js from the [official website](https://nodejs.org/).
- **npm**: Node.js installation includes npm.

### Clone the Repository

Clone the WebTM repository to your local machine:

```bash
git clone https://github.com/webtimemachine/wtm2.git
cd wtm2/app
```

### Install Dependencies

Install the required dependencies by running:

```bash
npm install
```

## Development

The development setup allows you to run and test the extension in both Chrome and Firefox browsers.

### Extension instalation and development

- Build the chrome extension or started it on watch mode with

```
  npm run build:chrome
```

```
  npm run nodemon:chrome
```

> after the build is complete you will find the folder `app_chrome` at the root of the respository

- Open the extensions page of Google Chrome under `chrome://extensions/`

  1. Enable `Developer mode`
  2. Click on the `Load unpacked` button to load the recently build extension
     - To load the extension navigate to the folder `app_chrome` and select it

- Now you should see the app install on you browser and you will le able to login to a cloud instance and start using the WTM

![App build and load](/gif-and-videos/app-build-and-load.gif)

## Build

The extension needs to be built separately for Chrome and Firefox. The build process ensures that the output files match the declarations made in the manifest files.

### Build for Chrome

To build the extension for Chrome:

```bash
npm run build:chrome
```

This command generates a `dist` folder compatible with the Chrome browser in a folder named `app_chrome`.

### Build for Firefox

To build the extension for Firefox:

```bash
npm run build:firefox
```

This command generates a `dist` folder compatible with the Firefox browser in a folder named `app_firefox`.

## Testing

To run the tests, use the following command:

```bash
npm test
```

This command will run all the tests configured with Jest. The project uses `@testing-library/react` for testing React components.

## Configuration

### Vite Configuration

The extension uses a custom Vite configuration (`vite.config.ts`) to handle different build outputs for Chrome and Firefox. The configuration dynamically selects the manifest file based on the `BROWSER` environment variable.

### Manifest Files

Two separate manifest files are used for Chrome and Firefox:

- **`manifest-chrome.ts`**: Configuration specific to Chrome, including content scripts, permissions, and content security policies.
- **`manifest-firefox.ts`**: Configuration specific to Firefox, including browser-specific settings for Gecko, background scripts, and permissions.
