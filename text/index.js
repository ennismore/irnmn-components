import { 
    dispatchSyncEvent, 
    handleSyncEvent, 
    saveToSessionStorage, 
    getFromSessionStorage 
} from '../utils/componentsUtils.js';

class IRNMNText extends HTMLElement {
    constructor() {
        super();
        this.label = this.getAttribute('label') || 'Text';
        this.placeholder = this.getAttribute('placeholder') || 'Enter Text';
        this.name = this.getAttribute('name');
        this.value = '';  // Holds the input value
        this.storageKey = `${this.name}-text`;  // Key for session storage
    }

    connectedCallback() {
        this.render();
        this.loadFromSessionStorage();

        // Listen for updates across instances
        document.addEventListener(`irnmn-text-updated-${this.name}`, (e) => this.syncText(e));
    }

    disconnectedCallback() {
        document.removeEventListener(`irnmn-text-updated-${this.name}`, this.syncText);
    }

    render() {
        this.innerHTML = `
            <label>${this.label}</label>
            <input name="${this.name}" type="text" placeholder="${this.placeholder}" value="${this.value}" />
        `;
        this.inputElement = this.querySelector('input');
        this.inputElement.addEventListener('input', (e) => this.handleInput(e));
    }

    handleInput(e) {
        this.value = e.target.value;

        // Update session storage and dispatch sync event
        saveToSessionStorage(this.storageKey, this.value);
        dispatchSyncEvent(`irnmn-text-updated-${this.name}`, { value: this.value });
    }

    syncText(event) {
        handleSyncEvent(event, { value: this.value }, (newState) => {
            this.value = newState.value;
            this.inputElement.value = this.value;
        });
    }

    loadFromSessionStorage() {
        const storedValue = getFromSessionStorage(this.storageKey);
        if (storedValue) {
            this.value = storedValue;
            this.inputElement.value = this.value;
        }
    }
}

customElements.define('irnmn-text', IRNMNText);
