
/**
 * This file contains the parsing logic for different business listing websites.
 * Each function is responsible for extracting data from a specific site's DOM.
 * 
 * ============================================================================
 * !! IMPORTANT !!
 * The CSS selectors used here are EXAMPLES and are highly likely
 * to be outdated. They WILL break when websites update their layout. You
 * must manually inspect the target websites and update these selectors
 to ensure the clipper functions correctly. Use your browser's DevTools.
 * ============================================================================
 */

/**
 * Safely queries a selector and returns its text content, or a default value.
 * @param {string} selector - The CSS selector to query.
 * @param {Element} [parent=document] - The parent element to search within.
 * @param {string} [defaultValue=''] - The value to return if not found.
 * @returns {string}
 */
const getText = (selector, parent = document, defaultValue = '') => {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : defaultValue;
};

/**
 * Parses a numeric string (e.g., "$1,234.56K", "€500M") into a number.
 * @param {string} text - The string to parse.
 * @returns {number | null}
 */
const parseNumber = (text) => {
    if (!text) return null;
    // Remove currency symbols, commas, etc., but keep the decimal point.
    let numStr = text.replace(/[^0-9.]/g, '');
    let num = parseFloat(numStr);
    if (isNaN(num)) return null;

    const upperText = text.toUpperCase();
    if (upperText.includes('K')) {
        num *= 1000;
    } else if (upperText.includes('M')) {
        num *= 1000000;
    }
    return Math.round(num); // Return a whole number
};


/**
 * Parser for Flippa.com listings.
 * @returns {object} - The scraped deal information matching app's URL params.
 */
function getFlippaData() {
    // NOTE: These selectors are illustrative and need to be verified on the live site.
    const deal_name = getText('h1[class*="ListingHeading-title"]');
    const purchase_price = parseNumber(getText('[data-cy="listing-heading-price"]'));
    const industry = getText('[data-cy="listing-heading-summary"]', document, 'Online Business');

    return {
        deal_name,
        purchase_price,
        industry,
        // Most Flippa listings are asset sales.
        purchase_type: 'asset', 
    };
}


/**
 * Parser for Acquire.com listings.
 * @returns {object} - The scraped deal information matching app's URL params.
 */
function getAcquireData() {
    // NOTE: These selectors are illustrative and need to be verified on the live site.
    const deal_name = getText('h1[data-testid="listing-headline"]');
    
    let purchase_price = null;
    let industry = 'SaaS'; // Default, but can be improved
    
    // On Acquire.com, data is often in labeled sections. We find the label
    // and then get the data from the corresponding value element.
    const allStats = document.querySelectorAll('div[class*="Stat---"]');
    allStats.forEach(stat => {
        const labelEl = stat.querySelector('div[class*="Stat---label"]');
        if (labelEl) {
            const labelText = labelEl.textContent.trim().toLowerCase();
            if (labelText.includes('asking price')) {
                const valueEl = stat.querySelector('p[class*="Stat---value"]');
                if (valueEl) {
                    purchase_price = parseNumber(valueEl.textContent);
                }
            }
        }
    });

    // Try to find the industry tag
    const industryTag = document.querySelector('a[href*="/marketplaces/"]');
    if (industryTag) {
        industry = industryTag.textContent.trim();
    }

    return {
        deal_name,
        purchase_price,
        industry,
        purchase_type: 'asset', // Often the case, but could be stock
    };
}
