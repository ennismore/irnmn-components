/**
 * Save value to sessionStorage and trigger a global custom event when the value is updated.
 * @param {string} key - The key for sessionStorage.
 * @param {string} value - The value to be stored.
 */
export function saveToSessionStorage(key, value) {
    if (value) {
        sessionStorage.setItem(key, value);

        // Trigger custom event when the sessionStorage value is updated
        const event = new CustomEvent('calendar-storage-update', {
            detail: {
                key,
                value
            }
        });

        window.dispatchEvent(event); // Dispatch the event globally
    }
}

/**
 * Get value from sessionStorage.
 * @param {string} key - The key to retrieve from sessionStorage.
 * @returns {string | null} - The stored value or null if not found.
 */
export function getFromSessionStorage(key) {
    return sessionStorage.getItem(key);
}

/**
 * Remove a key from sessionStorage.
 * @param {string} key - The key to remove from sessionStorage.
 */
export function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

/**
 * Clear both check-in and check-out dates from sessionStorage.
 * @param {string} startKey - Key for check-in date.
 * @param {string} endKey - Key for check-out date.
 */
export function clearSessionData(startKey, endKey) {
    removeFromSessionStorage(startKey);
    removeFromSessionStorage(endKey);
}
