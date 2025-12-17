
# AcquiStack AI Clipper - Browser Extension

This browser extension allows you to scrape key deal information from business listing websites and import it directly into the AcquiStack AI application for analysis.

## 1. Initial Setup

Before you can use the extension, you need to complete two essential steps.

### Step 1: Add Icons

The extension requires icons to be displayed in the browser's toolbar and extension management page.

1.  Create a new folder named `icons` inside this `extension` directory.
2.  Inside the `extension/icons/` folder, add three PNG images with the following exact names and dimensions:
    *   `icon16.png` (16x16 pixels)
    *   `icon48.png` (48x48 pixels)
    *   `icon128.png` (128x128 pixels)

### Step 2: Configure Your App URL

The extension needs to know where to send the scraped data.

1.  Open the file `extension/service_worker.js`.
2.  Find the line with the `ACQUISTACK_AI_URL` constant.
3.  Replace the placeholder URL `https://[REPLACE-WITH-YOUR-WEB-APP-URL]/` with the actual, deployed URL of your AcquiStack AI web application.

```javascript
// Before
const ACQUISTACK_AI_URL = "https://[REPLACE-WITH-YOUR-WEB-APP-URL]/";

// After (Example)
const ACQUISTACK_AI_URL = "https://acquistack-ai-prod.your-domain.com/";
```

## 2. How to Install in Chrome

This extension is loaded as an "unpacked" extension, which is standard for development.

1.  Open Google Chrome and navigate to `chrome://extensions`.
2.  In the top-right corner of the page, toggle on **Developer mode**.
3.  A new menu of buttons will appear on the top-left. Click **Load unpacked**.
4.  A file selection dialog will open. Navigate to your project folder and select the **`extension`** directory.
5.  Click "Select Folder".

The "AcquiStack AI Clipper" will now appear in your list of extensions, and its icon should be visible in your browser's toolbar (you may need to click the puzzle piece icon to pin it).

## 3. How to Use

1.  Navigate to a business listing page on a supported website (e.g., a specific listing on Flippa.com or Acquire.com).
2.  Click the AcquiStack AI Clipper icon in your browser toolbar.
3.  A small popup will appear. Click the **"Import Deal Information"** button.
4.  The extension will scrape the page, and if successful, a new browser tab will open with your AcquiStack AI application, with the "Deal Information" form pre-populated.

## 4. How to Extend (Add a New Site)

The extension is designed to be easily expandable to support new listing websites.

1.  **Inspect the New Site**: Go to a listing page on the new site you want to support (e.g., `bizbuysell.com`). Use your browser's Developer Tools (right-click -> Inspect) to find the unique CSS selectors for the data you want to scrape (e.g., Deal Name, Asking Price, Industry).

2.  **Create a Parser Function**: Open the `extension/parsers.js` file. Add a new JavaScript function that contains the scraping logic for the new site. Follow the pattern of the existing `getFlippaData` and `getAcquireData` functions.

    ```javascript
    // Example for a new site
    function getBizBuySellData() {
        // Find the selectors for this specific site
        const deal_name = getText('h1.bfsTitle'); 
        const purchase_price = parseNumber(getText('.askingPrice'));
        const industry = getText('.industry-info');

        return {
            deal_name,
            purchase_price,
            industry,
            purchase_type: 'asset',
        };
    }
    ```

3.  **Update the Content Script**: Open the `extension/content_script.js` file. Add an `else if` condition to the block that checks the URL. This tells the extension to use your new parser function when it's on the new site.

    ```javascript
    // ... existing code ...
    if (url.includes('flippa.com/')) {
        data = getFlippaData();
    } else if (url.includes('acquire.com/')) {
        data = getAcquireData();
    } else if (url.includes('bizbuysell.com/')) { // Add this new block
        data = getBizBuySellData();
    } else {
        error = "This website is not currently supported.";
    }
    // ... existing code ...
    ```

4.  **Reload the Extension**: Go back to `chrome://extensions`. Find the AcquiStack AI Clipper and click the "Reload" button (a circular arrow icon). The extension is now updated with support for the new site.
