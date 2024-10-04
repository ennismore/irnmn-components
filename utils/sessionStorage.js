/**
 * Functions to save, get and remove data from session storage
 * Can be used across multiple components
 */

export function saveToSessionStorage(key, value) {
    if (value) {
        sessionStorage.setItem(key, value);
    }
}

export function getFromSessionStorage(key) {
    return sessionStorage.getItem(key);
}

export function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
}

export function clearSessionData(startKey, endKey) {
    removeFromSessionStorage(startKey);
    removeFromSessionStorage(endKey);
}
