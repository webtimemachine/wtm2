// test/extension.test.js
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

// Use fileURLToPath to convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


(async () => {
    // Specify the path to the extension directory
    const extensionPath = path.resolve(__dirname, '../../../native/app_chrome');  // Root directory of the extension and manifest

    console.log("Extension Path:", extensionPath); // Log the path for debugging

    // Launch a new instance of Chrome with the extension loaded
    const browser = await puppeteer.launch({
        headless: false, // We use headless: false to see the browser while testing; set to true for CI or headless testing.
        args: [
            `--disable-extensions-except=/home/liza_saravia/wtm2/native/app_chrome`,
            `--load-extension=/home/liza_saravia/wtm2/native/app_chrome`,
        ],
    });

    // Create a new page (tab) to interact with your extension
    const page = await browser.newPage();

    // Open a new tab and navigate to a test URL, or any page where your extension should work
    await page.goto('https://webtm.io/');

    // Allow time for extension scripts to load; can be optimized
    await page.waitForTimeout(1000);

    // Locate elements from your extension UI, if any, using the Chrome DevTools extension API or page selectors
    
    // Define the path to your manifest file
    const manifestPath = path.resolve(__dirname, '../../../native/app_chrome/manifest.json');
    
    // Define the required fields for the manifest
    const requiredFields = [
        'manifest_version',
        'name',
        'version',
        'description',
        'permissions'
    ];

    // Utility function to load and parse the manifest file
    function loadManifest() {
        try {
        const manifestData = fs.readFileSync(manifestPath, 'utf-8');
        return JSON.parse(manifestData);
        } catch (error) {
        console.error("Error reading the manifest file:", error);
        return null;
        }
    }

    // Validation function to check for required fields
function validateManifest(manifest) {
    let allChecksPassed = true;
  
    requiredFields.forEach(field => {
      if (!manifest.hasOwnProperty(field)) {
        console.error(`❌ Missing required field: ${field}`);
        allChecksPassed = false;
      } else {
        console.log(`✅ Found required field: ${field}`);
      }
    });
    return allChecksPassed;
}

// Run the manifest validation test
function runManifestValidationTest() {
    console.log("Running Manifest Validation Test...");
  
    const manifest = loadManifest();
    if (!manifest) {
      console.error("Failed to load manifest. Aborting test.");
      return;
    }
  
    const result = validateManifest(manifest);
  
    if (result) {
      console.log("🎉 Manifest validation test passed!");
    } else {
      console.error("❌ Manifest validation test failed.");
    }
  }
  
  // Execute the test when the script runs
  runManifestValidationTest();

    // // Close the browser after the test is done
    // await browser.close();
})();
