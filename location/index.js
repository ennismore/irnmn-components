import { CLASS_NAMES } from './utils/constants.js';

class IRNMNLocation extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.parentForm = this.closest('form');
        this.render();
        this.attachEventListeners();
    }



    /**
     * Get the locations from the attribute, using try/catch to handle invalid JSON.
     * 
     * @return {Array} Locations array or empty.
     */
    get locations() {
        const locationsAttr = this.getAttribute('locations');

        try {
            return JSON.parse(locationsAttr);  // Parse JSON object for locations
        } catch (e) {
            console.error("Invalid JSON for locations attribute");
        }
    }



    /**
     * Get the label for the location select.
     * @return {String} Label or default value 'Select Location'.
     */
    get label() {
        return this.getAttribute('label') || 'Select Location';
    }


    /**
     * Get the ID for the location select.
     * @return {String} ID or default value 'irnmn-location-select'.
     */
    get inputId() {
        return this.getAttribute('id') || 'irnmn-location-select';
    }

    /**
     * Get the name for the location select.
     * 
     * @return {String} Name or default value 'location'.
     */
    get inputName() {
        return this.getAttribute('name') || 'location';
    }


    /**
     * Get the placeholder for the location select.
     * 
     * @return {String} Placeholder or default value 'Select a location'.
     */
    get placeholder() {
        return this.getAttribute('placeholder') || 'Select a location';
    }


    /**
     * Get the error message for the location select.
     * 
     * @return {String} Error message or default value 'Please select a valid location'.
     */
    get errorMessage() {
        return this.getAttribute('error-message') || 'Please select a valid location';
    }


    render() {
        if (!this.locations) {
            console.error("No locations provided");
            return;
        }
    
        this.innerHTML = `
            <div class="${CLASS_NAMES.container}">
                <label for="${this.inputId}" class="${CLASS_NAMES.label}">${this.label}</label>
                <select id="${this.inputId}" name="${this.inputName}" class="${CLASS_NAMES.select}">
                    <option value="" disabled selected>${this.placeholder}</option>
                    ${this.locations.map(location => {
                        // Dynamically create the data attributes based on the locations obj
                        const dataAttributes = Object.entries(location)
                            .map(([key, value]) => {
                                const dataAttrName = `data-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                                return `${dataAttrName}="${value}"`;
                            }).join(' ');
    
                        return `
                            <option value="${location.hotelCode}" ${dataAttributes} class="${CLASS_NAMES.option}">
                                ${location.name}
                            </option>`;
                    }).join('')}
                </select>
                <span class="${CLASS_NAMES.errorMessage}"></span>
            </div>
        `;
    }



    attachEventListeners() {
        const selectElement = this.querySelector(`.${CLASS_NAMES.select}`);
        selectElement.addEventListener('change', (event) => this.handleLocationChange(event));
    }


    /**
     * Handles the change event for the location select element.
     * It updates the other components within the parent form based on the selected location.
     * 
     * @param {Event} event - The change event object.
     * 
     * @return {void}
     */
    handleLocationChange(event) {
        const selectedOptions = event.target.selectedOptions;
        if ( !selectedOptions.length ) {
            return;
        }
        const selectedOption = selectedOptions[0];
        const errorMessageEl = this.querySelector(`.${CLASS_NAMES.errorMessage}`);

        if (!selectedOption.value) {
            errorMessageEl.textContent = this.errorMessage;
        } else {
            errorMessageEl.textContent = ''; // Clear error message when valid location is selected
            this.updateOtherComponents(selectedOption.dataset);
        }
    }

    /**
     * Updates the components within the parent form based on the selected location's properties.
     * It doesn't matter which component it is, as long as it has the corresponding data attributes.
     * @param {Object} selectedLocation - The selected location object containing properties.
     * 
     * @return {void}
     */
    updateOtherComponents(selectedLocation) {    
        Object.entries(selectedLocation).forEach(([attrName, attributeValue]) => {
            const formattedAttrName = attrName.replace(/([A-Z])/g, '-$1').toLowerCase();
    
            this.parentForm.querySelectorAll(`[${formattedAttrName}]`).forEach(element => {
                element.setAttribute(formattedAttrName, attributeValue);
            });
        });
    }
}

customElements.define('irnmn-location', IRNMNLocation);