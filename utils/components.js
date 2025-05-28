// componentUtils.js

/**
 * Dispatches a custom event to sync state between components
 * @param {string} eventName - Name of the event to dispatch
 * @param {Object} detail - The data to pass along with the event
 */
export function dispatchSyncEvent(eventName, detail) {
    const event = new CustomEvent(eventName, { bubbles: true, detail });
    document.dispatchEvent(event);
}

/**
 * Handles the syncing of component state when a custom event is triggered
 * @param {Event} event - The event object
 * @param {Object} currentState - The current state of the component
 * @param {function} updateState - Callback to update the component's state
 */
export function handleSyncEvent(event, currentState, updateState) {
    const newState = event.detail;
    if (JSON.stringify(currentState) === JSON.stringify(newState)) return; // Prevent self-updates
    updateState(newState);
}

/**
 * Saves data to sessionStorage
 * @param {string} key - The key under which the data will be saved
 * @param {string} value - The value to save
 */
export function saveToSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
}

/**
 * Retrieves data from sessionStorage
 * @param {string} key - The key to retrieve the data from
 * @returns {string|null} - The value from sessionStorage
 */
export function getFromSessionStorage(key) {
    return sessionStorage.getItem(key);
}

/**
 * Clears session storage for the provided keys
 * @param {...string} keys - List of keys to clear from sessionStorage
 */
export function clearSessionData(...keys) {
    keys.forEach((key) => sessionStorage.removeItem(key));
}

/**
 * Toggles the display of an element
 * @param {HTMLElement} element - The element to toggle
 * @param {boolean} visible - Whether the element should be visible or hidden
 */
export function toggleVisibility(element, visible) {
    element.style.display = visible ? 'block' : 'none';
}

/**
 * Highlights a button element
 * @param {HTMLElement} button - The button to highlight
 * @param {string} className - The class name to apply
 */
export function highlightButton(button, className) {
    button.classList.add(className);
}

/**
 * Clears highlights on a list of buttons
 * @param {HTMLElement[]} buttons - List of buttons to clear highlights from
 * @param {string[]} classNames - Array of class names to clear
 */
export function clearHighlights(buttons, classNames = []) {
    buttons.forEach((button) => {
        classNames.forEach((className) => button.classList.remove(className));
    });
}

/**
 * Creates or updates a hidden input element within a form.
 *
 * @param {HTMLElement} container - The HTML element (usualy a form) to which the input will be added.
 * @param {string} name - The name attribute of the input element.
 * @param {string} value - The value to set for the input element.
 * @returns {HTMLInputElement} The created or updated input element.
 */
export function createHiddenInput(container, name, value) {
    let input = container.querySelector(`input[name="${name}"]`);
    if (input) {
        input.value = value;
        return input;
    }
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    container.appendChild(input);
    return input;
}

/**
 * Sanitizes a string to prevent injection attacks.
 * @param {string} str
 * @returns {string}
 */
function sanitize(str) {
    return String(str).replace(/[<>"'`;(){}]/g, '');
}

/**
 * Handles the external URL by creating hidden input elements for the form based on the action URL's search parameters.
 * If an input element with the same name already exists, its value is updated.
 *
 * Example : https://example-booking.com/?dateIn={checkin}&ridcode={hotelCode}&roomCount={rooms-total}
 * this will create hidden inputs for 'dateIn', 'ridcode', and 'roomCount' and assign the values from the form's existing fields 'checkin', 'hotelCode', and 'rooms-total'
 *
 * @param {HTMLFormElement} form - The form element to which the hidden inputs will be added.
 */
export function handleExternalUrl(form) {
    // if there is a pattern in the external service url, create inputs for the form
    let formData = new FormData(form);
    const url = new URL(form.action);
    const searchParams = url.searchParams;

    searchParams.forEach((value, key) => {
        const match = value.match(/^{(.+)}$/);

        // If the value is a placeholder (e.g., {checkin}), find the corresponding form data
        const inputValue = match ? formData.get(match[1]) ?? '' : value;

        // Sanitize the input value to prevent injection attacks
        const sanitizedValue = sanitize(String(rawValue).trim());

        // Creating/updating the input
        createHiddenInput(form, key, sanitizedValue);
    });
}
