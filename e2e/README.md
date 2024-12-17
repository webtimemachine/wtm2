# End-to-End (E2E) Tests

This directory contains the End-to-End (E2E) tests for the Web Time Machine (WebTM) project. These tests are implemented using Playwright to verify the functionality and integration of various project components, including the backend, browser extension, and web application.

---

## Directory Structure

The e2e directory is organized as follows:

```
e2e/
├── tests/ # Individual test cases
│ ├── browser/ # Tests for the browser extension
│ ├── web/ # Tests for the web application
│ └── backend/ # API and backend-related tests
├── utils/ # Utility functions and helpers for tests
├── playwright.config.ts # Configuration file for Playwright
```

---

## Getting Started

### Prerequisites

Before running tests, ensure the following components are up and running locally:

1. **Backend Server**: Start the backend services.
2. **Web Application**: Launch the web application development server.

Refer to the main project README for instructions on setting up these components.

### Installation

To install the dependencies required for E2E testing:

```sh
npm install
npx playwrigth install
```

---

## Running Tests

Playwright offers a variety of options for executing tests. Here are some common commands:

### Run All Tests

```sh
npx playwright test
```

### Run a Specific Test File

```sh
npx playwright test tests/web/home.spec.ts
```

### Run Tests in a Specific Browser

```sh
npx playwright test --project=chromium
```

### Generate a Test Report

```sh
npx playwright show-report
```

---

## Configuration

The Playwright configuration is defined in the playwright.config.ts file. It includes:

- **Browsers**: Chromium, Firefox, and WebKit.
- **Timeouts**: Custom timeouts for long-running tests.
- **Reporters**: HTML and JSON reporting options.

You can modify this file to suit your specific testing requirements.

---

## Writing Tests

To add a new test, place it in the appropriate subdirectory under tests/. Here’s an example of a simple test:

```ts
import { test, expect } from '@playwright/test';

test.describe('Test description', () => {
  test('basic navigation test', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).toBe('Web Time Machine');
  });
});
```

### Best Practices

- Reuse Fixtures: Leverage shared setups in the fixtures/ folder.
- Isolated Tests: Ensure tests can run independently.
- Follow Conventions: Maintain naming and organizational standards.

---

## Debugging

To debug a test, run it in headed mode:

```sh
npx playwright test --headed --debug
```

This opens a browser UI and pauses execution at breakpoints, allowing for manual inspection.

---

## Reporting Issues

If you encounter issues during test execution, consider the following steps:

1. Verify that all required services are running.
2. Check for misconfigurations in playwright.config.ts.
3. Review error logs and reports in the test-results/ directory.

For unresolved issues, please open a ticket in the repository with detailed information.

---

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright VSCode Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
