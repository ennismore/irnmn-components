import { CLASS_NAMES } from './utils/constants.js';

class IRNMNGuestsSelector extends HTMLElement {
    constructor() {
        super();

        this.state = {
            adults: 1,
            children: 0,
            childAges: []
        };
    }

    connectedCallback() {
        this.setProperties();
        this.render();
        this.attachEventListeners();
    }

    setProperties() {
        this.name = this.getName();
        this.maxTotalGuests = this.getMaxTotalGuests();
        this.maxAdults = this.getMaxAdults();
        this.maxChildren = this.getMaxChildren();
        this.maxChildAge = this.getMaxChildAge();
        this.label = this.getLabel();
        this.childAgeLabel = this.getChildAgeLabel();
    }

    /**
     * Get the name.
     * @return {String} Name or default value 'room'.
     */
    getName() {
        return this.getAttribute('name') || 'room';
    }

    /**
     * Get the maximum total number of guests.
     * @return {Number} Max total guests or default value of 5.
     */
    getMaxTotalGuests() {
        return parseInt(this.getAttribute('max-total-guests')) || 5;
    }

    /**
     * Get the maximum number of adults.
     * @return {Number} Max adults or default value of 5.
     */
    getMaxAdults() {
        return parseInt(this.getAttribute('max-adults')) || 5;
    }

    /**
     * Get the maximum number of children.
     * @return {Number} Max children or default value of 5.
     */
    getMaxChildren() {
        return parseInt(this.getAttribute('max-children')) || 5;
    }

    /**
     * Get the maximum age for children.
     * @return {Number} Max child age or default value of 17.
     */
    getMaxChildAge() {
        return parseInt(this.getAttribute('max-child-age')) || 17;
    }

    /**
     * Get the label for the room.
     * @return {String} Label or default value 'Room'.
     */
    getLabel() {
        return this.getAttribute('label') || 'Room';
    }

    /**
     * Get the label for the child age input.
     * @return {String} Child age label or default value 'Age'.
     */
    getChildAgeLabel() {
        return this.getAttribute('child-age-label') || 'Child age';
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomContainer}">
                <div class="${CLASS_NAMES.roomHeader}">
                    <span class="${CLASS_NAMES.roomLabel}">${this.label} (max ${this.maxTotalGuests} guests)</span>
                    <button type="button" class="${CLASS_NAMES.removeRoomBtn}">Remove</button>
                </div>
                <div class="${CLASS_NAMES.guestControls}">
                    <irnmn-number-picker label="Adults" name="${this.name}[adults]" min="1" max="${this.maxAdults ?? this.maxTotalGuests}" initial-value="${this.state.adults}"></irnmn-number-picker>
                    <irnmn-number-picker label="Children" name="${this.name}[children]" min="0" max="${this.maxChildren ?? this.maxTotalGuests}" initial-value="${this.state.children}"></irnmn-number-picker>
                    <div class="${CLASS_NAMES.childrenAgeDropdowns}"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Listen for the valueChanged event from the "Adults" picker
        this.querySelector('irnmn-number-picker[label="Adults"]').addEventListener('valueChanged', (e) => {
            this.state.adults = e.detail.value;
            this.checkIfTotalGuestsReached();
        });

        // Listen for the valueChanged event from the "Children" picker
        this.querySelector('irnmn-number-picker[label="Children"]').addEventListener('valueChanged', (e) => {
            this.state.children = e.detail.value;
            this.checkIfTotalGuestsReached();
            this.renderChildrenAgeDropdowns();
        });

        this.querySelector(`.${CLASS_NAMES.removeRoomBtn}`).addEventListener('click', () => this.removeRoom());
    }

    checkIfTotalGuestsReached() {
        const totalGuests = this.state.adults + this.state.children;
        if (totalGuests >= this.maxTotalGuests) {
            this.disableIncrementButtons();
        } else {
            this.enableIncrementButtons();
        }
    }

    disableIncrementButtons() {
        const adultsPicker = this.querySelector('irnmn-number-picker[label="Adults"]');
        const childrenPicker = this.querySelector('irnmn-number-picker[label="Children"]');

        adultsPicker.querySelector(`.${CLASS_NAMES.incrementBtn}`).disabled = true;
        childrenPicker.querySelector(`.${CLASS_NAMES.incrementBtn}`).disabled = true;
    }

    enableIncrementButtons() {
        const adultsPicker = this.querySelector('irnmn-number-picker[label="Adults"]');
        const childrenPicker = this.querySelector('irnmn-number-picker[label="Children"]');

        adultsPicker.querySelector(`.${CLASS_NAMES.incrementBtn}`).disabled = false;
        childrenPicker.querySelector(`.${CLASS_NAMES.incrementBtn}`).disabled = false;
    }


    renderChildrenAgeDropdowns() {
        const childAgeContainer = this.querySelector(`.${CLASS_NAMES.childrenAgeDropdowns}`);
        childAgeContainer.innerHTML = ''; // Clear existing dropdowns

        for (let i = 1; i <= this.state.children; i++) {
            const ageDropdown = document.createElement('select');
            ageDropdown.setAttribute('id', `irnmn-child-age-${i}`);
            ageDropdown.setAttribute('name', `${this.name}[childrenAges][${i - 1}]`);
            ageDropdown.innerHTML = this.generateAgeOptions(this.maxChildAge);

            // Initialize childAges[i - 1] to 1 if not already set
            if (!this.state.childAges[i - 1]) {
                this.state.childAges[i - 1] = 1;  // Set default age to 1
            }

            ageDropdown.value = this.state.childAges[i - 1]; // Set the dropdown value to the initialized age

            // Dispatch event on change
            ageDropdown.addEventListener('change', () => {
                this.state.childAges[i - 1] = parseInt(ageDropdown.value);

                // Emit custom event with the entire childAges array when any child age changes
                this.dispatchEvent(new CustomEvent('roomValuesChange', {
                    detail: this.state
                }));
            });
            // create a label for the child age select
            const label = document.createElement('label');
            label.textContent = `${this.childAgeLabel} (${i})`;
            // create a wrapper for label and select
            const ageWrapper = document.createElement('div');
            ageWrapper.classList.add('irnmn-child-age-wrapper');
            ageWrapper.appendChild(label);
            ageWrapper.appendChild(ageDropdown);
            // append everything to the container
            childAgeContainer.appendChild(ageWrapper);

            // Emit event after adding select to the DOM (usefull for custom dropdowns)
            this.dispatchEvent(new CustomEvent('initChildAgeDropdowns', {
                detail: {
                    ID: `irnmn-child-age-${i}`,
                    element: ageDropdown
                }
            }));
        }

        // Emit event after setting default values for childAges
        this.dispatchEvent(new CustomEvent('roomValuesChange', {
            detail: this.state
        }));
    }

    generateAgeOptions(maxAge) {
        let options = '';
        for (let i = 1; i <= maxAge; i++) {
            options += `<option value="${i}">${i}</option>`;
        }
        return options;
    }

    removeRoom() {
        // Dispatch a custom event to inform the parent to remove this room
        this.dispatchEvent(new CustomEvent('roomRemoved', {
            detail: { roomLabel: this.label },
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('irnmn-guests-selector', IRNMNGuestsSelector);
