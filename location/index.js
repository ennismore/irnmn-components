class IRNMNLocation extends HTMLElement {
    constructor() {
        super();
        this.locations = [];
    }

    connectedCallback() {
        this.parentForm = this.closest('form');
        this.initProperties();
        this.render();
        this.attachEventListeners();
    }

    initProperties() {
        const locationsAttr = this.getAttribute('locations');

        try {
            this.locations = JSON.parse(locationsAttr);  // Parse JSON object for locations
        } catch (e) {
            console.error("Invalid JSON for locations attribute");
            this.locations = [];
        }

        this.label = this.getAttribute('label') || 'Select Location';
        this.inputId = this.getAttribute('id') || 'irnmn-location-select';
        this.inputName = this.getAttribute('name') || 'location';
        this.placeholder = this.getAttribute('placeholder') || 'Select a location';
        this.errorMessage = this.getAttribute('error-message') || 'Please select a valid location';
    }

    render() {
        this.innerHTML = `
            <div class="irnmn-location__container">
                <label for="${this.inputId}" class="irnmn-location__label">${this.label}</label>
                <select id="${this.inputId}" name="${this.inputName}" class="irnmn-location__select">
                    <option value="" disabled selected>${this.placeholder}</option>
                    ${this.locations.map(location => 
                        `<option value="${location.hotelCode}" 
                            data-max-rooms="${location.maxRooms}" 
                            data-min-rooms="${location.minRooms}"
                            data-open-date="${location.openDate}"
                            data-date-display-format="${location.dateDisplayFormat}"
                            data-date-locale="${location.dateLocale}">
                            ${location.name}
                        </option>`
                    ).join('')}
                </select>
                <irnmn-select></irnmn-select>
                <span class="irnmn-location__error-message"></span>
            </div>
        `;
    }

    attachEventListeners() {
        const selectElement = this.querySelector('.irnmn-location__select');
        selectElement.addEventListener('change', (event) => this.handleLocationChange(event));
    }

    handleLocationChange(event) {
        const selectedOption = event.target.selectedOptions[0];
        const errorMessageEl = this.querySelector('.irnmn-location__error-message');
        // define value of the select

        if (!selectedOption.value) {
            errorMessageEl.textContent = this.errorMessage;
        } else {
            errorMessageEl.textContent = ''; // Clear error message when valid location is selected
            this.updateOtherComponents(selectedOption.dataset);
        }
    }

    /**
     * Updates the components within the parent form based on the selected location's properties.
     * It doesn't matter which compoment it is, as long as it has the corresponding data attributes.
     * @param {Object} selectedLocation - The selected location object containing properties.
     * 
     * @return {void}
     */
    updateOtherComponents(selectedLocation) {    
        // Directly iterate over the key-value pairs of the selectedLocation object
        Object.entries(selectedLocation).forEach(([attrName, attributeValue]) => {
            // Convert format to match with the attributes (e.g openDate -> open-date)
            const formattedAttrName = attrName.replace(/([A-Z])/g, '-$1').toLowerCase();
    
            this.parentForm.querySelectorAll(`[${formattedAttrName}]`).forEach(element => {
                element.setAttribute(formattedAttrName, attributeValue);
            });
        });
    }
    
    
}

customElements.define('irnmn-location', IRNMNLocation);
