
document.addEventListener('DOMContentLoaded', () => {
    const importButton = document.getElementById('import-deal-btn');
    const statusMessage = document.getElementById('status-message');

    importButton.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tab?.id) {
                importButton.disabled = true;
                statusMessage.textContent = 'Importing...';

                // Send a message to the service worker to start the import process
                const response = await chrome.runtime.sendMessage({
                    action: "startImport",
                    tabId: tab.id
                });
                
                if (response.success) {
                    statusMessage.textContent = 'Success! Opening AcquiStack AI...';
                    // The window will close automatically after a short delay
                    setTimeout(() => window.close(), 1500);
                } else {
                    statusMessage.textContent = response.error || 'Failed to import. Site may not be supported.';
                    importButton.disabled = false;
                }
            } else {
                statusMessage.textContent = 'Could not find an active tab.';
            }
        } catch (error) {
            console.error('AcquiStack AI Clipper - Popup Error:', error);
            statusMessage.textContent = 'An error occurred. Check the console.';
            importButton.disabled = false;
        }
    });
});
