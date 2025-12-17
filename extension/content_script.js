
// This function is the entry point for the script injected into the page.
// It uses an IIFE to avoid polluting the global scope of the host page.
(() => {
    const url = window.location.href;
    let data = null;
    let error = null;

    try {
        if (url.includes('flippa.com/')) {
            // getFlippaData is defined in the co-injected parsers.js
            data = getFlippaData();
        } else if (url.includes('acquire.com/')) {
            // getAcquireData is defined in the co-injected parsers.js
            data = getAcquireData();
        } else {
            error = "This website is not currently supported.";
        }
    } catch (e) {
        console.error("AcquiStack AI Clipper - Content Script Error:", e);
        error = `An error occurred while parsing the page: ${e.message}`;
    }

    // The last expression in an executeScript content script is its return value.
    // This object is sent back to the service worker.
    if (error) {
        return { success: false, error: error };
    } else {
        return { success: true, data: data };
    }
})();
