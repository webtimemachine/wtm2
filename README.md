# WebTM ![WTM  Website](https://cronitor.io/badges/CbeIhd/production/7FN5-J8hdv7hTI7zSN0Yyc6TBw0.svg) ![WTM  API](https://cronitor.io/badges/DOrpsj/production/0PbZKWShlq8iS_6_sPowwKHxKVI.svg)<img align="right" width="100" height="100" src="./apps/extension/public/app-icon.png">

Web Time Machine (WebTM) is an open-source, cross-platform browser extension and web application designed to provide users with a seamless experience to access, search, and manage their browsing history. The project integrates advanced AI-powered features, allowing users to efficiently search through their browsing history and filter explicit content.

### Table of Contents

- [WebTM  ](#webtm--)
    - [Table of Contents](#table-of-contents)
    - [Overview](#overview)
    - [Core Components](#core-components)
      - [Backend](#backend)
      - [Browser Extension](#browser-extension)
      - [Web Page](#web-page)
    - [Getting Started](#getting-started)
      - [Clone the Repository](#clone-the-repository)
      - [Install Dependencies](#install-dependencies)
      - [Development Setup](#development-setup)
    - [Folder Structure](#folder-structure)
    - [Contributing](#contributing)
    - [License](#license)
    - [Contact](#contact)

### Overview

WebTM consists of a backend service, a browser extension compatible with multiple browsers, and a standalone web page. The backend is built with NestJS and integrated with OpenAI and Weaviate to provide AI-powered search capabilities and explicit content filtering. The browser extension is built with React, TypeScript, and Vite, while the web page is built with Next.js and offers a responsive UI for both desktop and mobile users.

### Core Components

#### Backend

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL (via Prisma ORM)
- **AI Integration**: OpenAI, Weaviate
- **Deployment**: Deployed on Vercel
- **Functionality**: Provides REST API for user authentication, session management, data storage, AI-based search, and explicit content filtering.
- **[Backend README](apps/backend/README.md)**: Detailed setup and usage instructions for the backend.

#### Browser Extension

- **Framework**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite](https://vitejs.dev/)
- **State Management**: React Query, Zustand
- **UI Library**: Chakra UI, Tailwind CSS
- **Compatibility**: Chrome, Firefox, Safari, Safari iOS, Firefox Android
- **Functionality**: Tracks browsing history, sends data to the backend, and provides an AI-based search within the extension popup.
- **[Browser Extension README](apps/extension/README.md)**: Detailed setup and usage instructions for the browser extension.

#### Web Page

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: Tailwind CSS, Chakra UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Deployment**: Vercel
- **Functionality**: Allows users to log in, view their browsing data, and utilize WebTM features without needing the extension.
- **[Webpage README](apps/webpage/README.md)**: Detailed setup and usage instructions for the web page.

### Getting Started

To set up the WebTM project locally, follow the instructions below.

#### Clone the Repository

```bash
git clone https://github.com/webtimemachine/wtm2.git
cd wtm2
```

#### Install Dependencies

Install dependencies for each core component:

1. **Backend**:

   ```bash
   cd backend
   npm install
   ```

2. **Browser Extension**:

   ```bash
   cd ../app
   npm install
   ```

3. **Web Page**:

   ```bash
   cd ../webpage
   npm install
   ```

#### Development Setup

1. **Backend**:

   Start the backend development server:

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Browser Extension**:

   Start the extension development server:

   ```bash
   cd ../app
   npm run dev
   ```

3. **Web Page**:

   Start the web page development server:

   ```bash
   cd ../webpage
   npm run dev
   ```

   The web page will be available at [http://localhost:3000](http://localhost:3000).

### Folder Structure

The repository is organized as follows:

- **/backend**: Contains the NestJS backend application code.
- **/app**: Contains the browser extension code built with React, TypeScript, and Vite.
- **/webpage**: Contains the Next.js-based web page code.
- **/lib**: Contains shared libraries and utilities used across multiple components.

### Contributing

Contributions are welcome! If you have suggestions, improvements, or find bugs, please open an issue or submit a Pull Request. Make sure to follow the code of conduct and contribution guidelines.

### License

This project is licensed under the AGPL-3.0 License - see the [LICENSE](LICENSE) file for details.

### Contact

For any inquiries, please reach out to the [WebTM team](https://www.webtm.io).

Created by ttt246
