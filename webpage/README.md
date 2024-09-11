# WebTM Web Page

The WebTM web page is a fully functional, standalone web application built with Next.js. Initially developed as a port of the Chrome extension's popup content, it has evolved into its own project with a responsive UI for both desktop and mobile devices. This web page allows users to log in, view their data, and use WebTM features without needing to install the browser extension.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Clone the repository](#clone-the-repository)
- [Install Dependencies](#install-dependencies)
- [Development Server](#development-server)
- [Build for Production](#build-for-production)
- [Testing](#testing)
- [Learn More about NextJS](#learn-more-about-nextjs)
- [Deploy on Vercel](#deploy-on-vercel)

## Project Structure

- **Framework**: [Next.js](https://nextjs.org/) (Version 14 with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Chakra UI](https://chakra-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Features

- **Cross-platform Access**: Users can log in and use WebTM features directly from a web page without the extension.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Enhanced UI**: A dedicated and refined user interface for a better desktop experience.
- **Integration with WebTM Backend**: Fetches user data and leverages WebTM’s backend capabilities.

## Clone the repository

```bash
git clone https://github.com/webtimemachine/wtm2.git
cd wtm2/webpage
```

## Install Dependencies

Make sure to link the shared library (`wtm-lib`) correctly.

```bash
npm install
```

## Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Build for Production

Build the application for production usage:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Testing

Run the tests using Jest:

```bash
npm run test
```

To run tests with coverage:

```bash
npm run test:cov
```

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Next.js**: A React framework for production.
- **Chakra UI**: A simple, modular, and accessible component library for React.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **TanStack Query**: Powerful asynchronous state management for React.
- **Zustand**: A small, fast, and scalable state-management solution for React.

## Dev Dependencies

- **Jest**: A delightful JavaScript Testing Framework.
- **Testing Library**: Utilities to help with testing React components.
- **ESLint**: A pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript.
- **TypeScript**: A typed superset of JavaScript that compiles to plain JavaScript.

## Learn More about NextJS

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
