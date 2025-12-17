
// ============================================================================
// !! IMPORTANT !!
// Replace this placeholder with the actual URL of your deployed web app.
// For local development, this might be your `localhost` address.
// ============================================================================
const ACQUISTACK_AI_URL = "https://[REPLACE-WITH-YOUR-WEB-APP-URL]/";


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startImport") {
        const tabId = request.tabId;

        // Use an async IIFE to handle the asynchronous logic
        (async () => {
            try {
                if (ACQUISTACK_AI_URL.includes("[REPLACE-WITH-YOUR-WEB-APP-URL]")) {
                    console.error("AcquiStack AI Clipper: The web app URL has not been configured in service_worker.js");
                    sendResponse({ success: false, error: "Extension not configured. See console." });
                    return;
                }

                const injectionResult = await chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['parsers.js', 'content_script.js'],
                });
                
                // The result of the content script is the last evaluated expression
                const scrapedResult = injectionResult[0].result;

                if (scrapedResult && scrapedResult.success) {
                    const params = new URLSearchParams();
                    for (const key in scrapedResult.data) {
                        const value = scrapedResult.data[key];
                        // Only append parameters that have a non-empty value
                        if (value !== null && value !== undefined && value !== '') {
                            params.append(key, value);
                        }
                    }

                    const targetUrl = new URL(ACQUISTACK_AI_URL);
                    targetUrl.search = params.toString();

                    // Open the AcquiStack AI app in a new tab with the data
                    chrome.tabs.create({ url: targetUrl.toString() });
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: scrapedResult.error || "No data was extracted from the page." });
                }
            } catch (e) {
                console.error("AcquiStack AI Clipper - Service Worker Error:", e);
                sendResponse({ success: false, error: "The scraping script failed to execute." });
            }
        })();

        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});
