import { CLASS_NAMES } from './utils/constants.js';

import {
    dispatchSyncEvent,
    saveToSessionStorage,
    handleSyncEvent,
    getFromSessionStorage,
} from '../utils/components.js';

class IRNMNLocation extends HTMLElement {
    constructor() {
        super();
        this.locations = [];
    }

    static get observedAttributes() {
        return ['show-error'];
    }

    /**
     * Handles attribute changes for the component.
     *
     * @param {string} name - The name of the attribute.
     * @param {string|null} oldValue - The old value of the attribute.
     * @param {string|null} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'show-error' && oldValue !== newValue) {
            this.renderErrorMessage();
        }
    }

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Initializes locations, renders the component, and attaches event listeners.
     */
    async connectedCallback() {
        this.parentForm = this.closest('form');
        this.locations = await this.getLocations();

        /**
         * Render the first time only when locations are loaded
         */
        this.render();
        this.attachEventListeners();
        Promise.resolve().then(() => this.setDefaultValue());

        // Add event listener for custom sync events
        document.addEventListener('locationSync', this.syncLocation.bind(this));
    }

    /**
     * Lifecycle method called when the component is removed from the DOM.
     * Cleans up event listeners to prevent memory leaks.
     */
    disconnectedCallback() {
        // Remove the custom sync event listener to avoid memory leaks
        document.removeEventListener(
            'locationSync',
            this.syncLocation.bind(this),
        );
    }

    syncLocation(event) {
        handleSyncEvent(
            event,
            {
                selectedValue:
                    this.querySelector(`input[name="${this.inputName}"]`)
                        ?.value || '',
            },
            (newState) => {
                // Update the preselected value in <irnmn-select>
                const irnmnSelect = this.querySelector('irnmn-select');
                if (irnmnSelect) {
                    irnmnSelect.setAttribute(
                        'preselected',
                        newState.selectedValue,
                    );
                    irnmnSelect.selectedOption = irnmnSelect.options.findIndex(
                        (option) => option.value === newState.selectedValue,
                    );
                    irnmnSelect.render();
                }

                // Update the hidden input value
                const hiddenInput = this.querySelector(
                    `input[name="${this.inputName}"]`,
                );
                if (hiddenInput) {
                    hiddenInput.value = newState.selectedValue;
                }
                // Dispatch the custom event to update other components
                const event = new CustomEvent('optionSelected', {
                    detail: {
                        value: newState.selectedValue,
                    },
                });
                irnmnSelect.dispatchEvent(event);
            },
        );
    }

    /**
     * Fetches locations either from the provided attribute or from an endpoint.
     *
     * @return {Array} The list of locations or an empty array.
     */
    async getLocations() {
        const locationsEndpoint = this.getAttribute('locations-endpoint');

        if (locationsEndpoint) {
            return await this.fetchLocations(locationsEndpoint);
        } else {
            return await this.parseLocations();
        }
    }

    /**
     * Parses the locations from the `locations` attribute.
     *
     * @return {Array} The list of locations or an empty array.
     */
    async parseLocations() {
        const locationsAttr = this.getAttribute('locations');

        try {
            return JSON.parse(locationsAttr);
        } catch (e) {
            console.error('Invalid JSON for locations attribute');
            return [];
        }
    }

    /**
     * Fetches locations from the provided endpoint.
     *
     * @param {string} locationsEndpoint - The URL to fetch the locations from.
     * @return {Array} The list of locations or an empty array.
     */
    async fetchLocations(locationsEndpoint) {
        try {
            const response = await fetch(locationsEndpoint);
            return await response.json();
        } catch (error) {
            console.error('Error fetching locations', error);
            return [];
        }
    }

    /**
     * Gets the label for the location dropdown.
     *
     * @return {string} The label text or the default "Select Location".
     */
    get label() {
        return this.getAttribute('label') || 'Select Location';
    }

    /**
     * Gets the default value for the location dropdown.
     *
     * @return {string} The default value or an empty string.
     */
    get default() {
        return this.getAttribute('default') || null;
    }

    /**
     * Gets the input ID for the location dropdown.
     *
     * @return {string} The input ID or a default value.
     */
    get inputId() {
        return this.getAttribute('id') || 'irnmn-location-select';
    }

    /**
     * Gets the input name for the location dropdown.
     *
     * @return {string} The input name or a default value.
     */
    get inputName() {
        return this.getAttribute('name') || 'location';
    }

    /**
     * Gets the placeholder for the location dropdown.
     *
     * @return {string} The placeholder text or a default value.
     */
    get placeholder() {
        return this.getAttribute('placeholder') || 'Select a location';
    }

    get showError() {
        return (
            this.hasAttribute('show-error') &&
            this.getAttribute('show-error') === 'true'
        );
    }

    get errorMessage() {
        return (
            this.getAttribute('error-message') ||
            'Please select a valid location'
        );
    }

    render() {
        if (!this.locations || this.locations.length === 0) {
            console.error('No locations provided');
            return;
        }

        const options = this.locations.map((location) => ({
            value: location.hotelCode, // Used as the unique identifier
            name: location.hotelName, // Used as the display text
        }));

        // Get the hidden input value or default value
        const preselectedValue =
            this.default || getFromSessionStorage(this.inputName) || '';

        this.innerHTML = `
            <div class="${CLASS_NAMES.container}">
                <label for="${this.inputId}" class="${CLASS_NAMES.label}">${this.label}</label>
                <irnmn-select
                    id="${this.inputId}"
                    name="${this.inputName}"
                    heading-text="${this.label}"
                    options='${JSON.stringify(options)}'
                    placeholder="${this.placeholder}"
                    preselected="${preselectedValue}">
                </irnmn-select>
                <!-- Hidden input to hold the selected hotelCode -->
                <input
                    type="hidden"
                    name="${this.inputName}"
                    value="${preselectedValue}"
                    required>
            </div>
        `;
    }

    /**
     * Attaches event listeners to the component.
     */
    attachEventListeners() {
        const irnmnSelect = this.querySelector('irnmn-select');

        // Listen to the custom "optionSelected" event from irnmn-select
        irnmnSelect.addEventListener('optionSelected', (event) =>
            this.handleLocationChange(event.detail),
        );
    }

    /**
     * Sets the default value for the dropdown and hidden input.
     */
    setDefaultValue() {
        const hiddenInput = this.querySelector(
            `input[name="${this.inputName}"]`,
        );
        const selectedValue = this.default || hiddenInput?.value || '';

        if (selectedValue) {
            const irnmnSelect = this.querySelector('irnmn-select');
            if (irnmnSelect) {
                irnmnSelect.setAttribute('preselected', selectedValue);
            }
            const selectedLocation = this.locations.find(
                (location) => location.hotelCode === selectedValue,
            );
            this.updateOtherComponents(selectedLocation);
        }
    }

    /**
     * Handles the change event for the location select element.
     * Logs the selected location and updates other components within the form.
     *
     * @param {Object} selectedDetail - The detail object from the "optionSelected" event.
     *
     * @return {void}
     */
    handleLocationChange(selectedDetail) {
        if (!selectedDetail || !selectedDetail.value) {
            return;
        }

        this.setAttribute('show-error', false);

        // Update the hidden input value
        const hiddenInput = this.querySelector(
            `input[name="${this.inputName}"]`,
        );
        if (hiddenInput) {
            hiddenInput.value = selectedDetail.value;
        }
        // Get the selected location object from locations
        const selectedLocation = this.locations.find(
            (location) => location.hotelCode === selectedDetail.value,
        );
        this.updateOtherComponents(selectedLocation);
        // Save to session storage
        saveToSessionStorage(this.inputName, selectedDetail.value);

        // Dispatch a sync event to update other components
        dispatchSyncEvent('locationSync', {
            selectedValue: selectedDetail.value,
        });
    }

    /**
     * Updates the components within the parent form based on the selected location's properties.
     * It doesn't matter which component it is, as long as it has the corresponding data attributes.
     * @param {Object} selectedLocation - The selected location object containing properties.
     *
     * @return {void}
     */
    updateOtherComponents(selectedLocation) {
        Object.entries(selectedLocation).forEach(
            ([attrName, attributeValue]) => {
                if (attrName === 'name') return; // Exclude the attribute "name"

                if (attrName === 'externalServiceUrl' && attributeValue) {
                    try {
                        const url = new URL(attributeValue);
                        this.parentForm.action = url.href;
                    } catch (e) {
                        console.error('Invalid URL for externalServiceUrl', e);
                    }
                }

                const formattedAttrName = attrName
                    .replace(/([A-Z])/g, '-$1')
                    .toLowerCase();

                this.parentForm
                    .querySelectorAll(`[${formattedAttrName}]`)
                    .forEach((element) => {
                        if (this != element && !this.contains(element)) {
                            // Avoid updating the current component
                            element.setAttribute(
                                formattedAttrName,
                                attributeValue,
                            );
                        }
                    });
            },
        );
    }

    renderErrorMessage() {
        if (this.showError) {
            const errorMessageElement = document.createElement('div');
            errorMessageElement.classList.add(CLASS_NAMES.errorMessage);
            errorMessageElement.textContent = this.errorMessage;
            this.appendChild(errorMessageElement);
        } else {
            this.querySelector(`.${CLASS_NAMES.errorMessage}`)?.remove();
        }
    }
}

customElements.define('irnmn-location', IRNMNLocation);
