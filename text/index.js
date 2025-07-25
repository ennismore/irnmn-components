import {
    dispatchSyncEvent,
    handleSyncEvent,
    saveToSessionStorage,
    getFromSessionStorage,
} from '../utils/components.js';
import { CLASS_NAMES } from './utils/constants.js';

export default class IRNMNText extends HTMLElement {
    constructor() {
        super();
        this.label = this.getAttribute('label') || 'Text';
        this.placeholder = this.getAttribute('placeholder') || 'Enter Text';
        this.name = this.getAttribute('name');
        this.value = this.getAttribute('value') || ''; // Holds the input value
        this.storageKey = `${this.name}-text`; // Key for session storage
    }

    // Getter for id (from the id attribute)
    get id() {
        return this.getAttribute('id') || '';
    }

    connectedCallback() {
        this.render();
        this.loadFromSessionStorage();

        // Listen for updates across instances
        document.addEventListener(`irnmn-text-updated-${this.name}`, (e) =>
            this.syncText(e),
        );
    }

    disconnectedCallback() {
        document.removeEventListener(
            `irnmn-text-updated-${this.name}`,
            this.syncText,
        );
    }

    /**
     * Render the custom text input with a label and input field.
     */
    render() {
        const { id } = this;
        const labelAttrs = id ? `for="${id}-field"` : '';
        const inputAttrs = id ? `id="${id}-field"` : '';
        this.innerHTML = `
            <div class="${CLASS_NAMES.textWrapper}">
                <label class="${CLASS_NAMES.label}" ${labelAttrs}>${this.label}</label>
                <input class="${CLASS_NAMES.input}" ${inputAttrs} name="${this.name}" type="text" placeholder="${this.placeholder}" value="${this.value}" />
            </div>
        `;
        this.inputElement = this.querySelector(`.${CLASS_NAMES.input}`);
        this.inputElement.addEventListener('input', (e) => this.handleInput(e));
    }

    /**
     * Handle user input in the text field, save it to session storage,
     * and dispatch a synchronization event for other instances.
     */
    handleInput(e) {
        this.value = e.target.value;

        // Update session storage and dispatch sync event
        saveToSessionStorage(this.storageKey, this.value);
        dispatchSyncEvent(`irnmn-text-updated-${this.name}`, {
            value: this.value,
        });
    }

    /**
     * Synchronize the text value across different instances of the component.
     *
     * @param {Event} event The synchronization event containing the updated value.
     */
    syncText(event) {
        handleSyncEvent(event, { value: this.value }, (newState) => {
            this.value = newState.value;
            this.inputElement.value = this.value;
        });
    }

    /**
     * Load the value from session storage if it exists and update the input field.
     */
    loadFromSessionStorage() {
        const storedValue = getFromSessionStorage(this.storageKey);
        if (storedValue) {
            this.value = storedValue;
            this.inputElement.value = this.value;
        }
    }
}

customElements.define('irnmn-text', IRNMNText);
