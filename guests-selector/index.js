import { CLASS_NAMES } from './utils/constants.js';

class IRNMNGuestsSelector extends HTMLElement {
    constructor() {
        super();

        this.state = {
            adults: 0,
            children: 0,
        };
    }

    connectedCallback() {
        this.setProperties();
        this.render();
        this.updateDisplay();
        this.attachEventListeners();
    }

    setProperties() {

        this.maxTotalGuests = this.getMaxTotalGuests();
        this.maxAdults = this.getMaxAdults();
        this.maxChildren = this.getMaxChildren();
        this.maxChildAge = this.getMaxChildAge();
        this.label = this.getLabel();
        this.childAgeLabel = this.getChildAgeLabel();
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
        return this.getAttribute('child-age-label') || 'Age';
    }
    
    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomContainer}">
                <div class="${CLASS_NAMES.roomHeader}">
                    <span class="${CLASS_NAMES.roomLabel}">${this.label} (max ${this.maxTotalGuests} guests)</span>
                    <button type="button" class="${CLASS_NAMES.removeRoomBtn}">Remove</button>
                </div>
                <div class="${CLASS_NAMES.guestControls}">
                    <irnmn-number-picker label="Adults" min="1" max="${this.maxAdults ?? this.maxTotalGuests}" initial-value="1"></irnmn-number-picker>
                    <irnmn-number-picker label="Children" min="0" max="${this.maxChildren ?? this.maxTotalGuests}" initial-value="0"></irnmn-number-picker>
                    <div class="${CLASS_NAMES.childrenAgeDropdowns}"></div>
                </div>
                <p class="${CLASS_NAMES.feedbackMessage}" style="color: red; display: none;">Max total guests exceeded</p>
            </div>
        `;
    }

    attachEventListeners() {
        // Listen for the valueChanged event from the "Adults" picker
        this.querySelector('irnmn-number-picker[label="Adults"]').addEventListener('valueChanged', (e) => {
            this.state.adults = e.detail.value;
            this.updateTotalGuests();
            this.updateDisplay(); // Call updateDisplay to reflect changes
        });

        // Listen for the valueChanged event from the "Children" picker
        this.querySelector('irnmn-number-picker[label="Children"]').addEventListener('valueChanged', (e) => {
            this.state.children = e.detail.value;
            this.updateTotalGuests();
            this.renderChildrenAgeDropdowns();
            this.updateDisplay(); // Call updateDisplay to reflect changes
        });

        this.querySelector(`.${CLASS_NAMES.removeRoomBtn}`).addEventListener('click', () => this.removeRoom());
    }

    updateTotalGuests() {
        const totalGuests = this.state.adults + this.state.children;
        const feedbackMessage = this.querySelector(`.${CLASS_NAMES.feedbackMessage}`);

        if (totalGuests > this.maxTotalGuests) {
            feedbackMessage.style.display = 'block';
            this.disableIncrementButtons();
        } else {
            feedbackMessage.style.display = 'none';
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

    updateDisplay() {
        this.querySelector('irnmn-number-picker[label="Adults"] .irnmn-number-picker__value').textContent = this.state.adults;
        this.querySelector('irnmn-number-picker[label="Children"] .irnmn-number-picker__value').textContent = this.state.children;
    }

    renderChildrenAgeDropdowns() {
        const container = this.querySelector(`.${CLASS_NAMES.childrenAgeDropdowns}`);
        container.innerHTML = ''; // Clear previous dropdowns

        let dropdowns = '';
        for (let i = 0; i < this.state.children; i++) {
            let options = '';
            for (let age = 0; age <= this.maxChildAge; age++) {
                options += `<option value="${age}">${age === 0 ? this.childAgeLabel : age}</option>`;
            }
        
            dropdowns += `
                <select class="child-age-dropdown" aria-label="${this.childAgeLabel}" aria-labelledby="child-age-label-${i}">
                    ${options}
                </select>
            `;
        }
        container.innerHTML += dropdowns;
    }

    removeRoom() {
        // Dispatch a custom event to inform the parent to remove this room
        this.dispatchEvent(new CustomEvent('roomRemoved', {
            detail: { roomLabel: this.label },
            bubbles: true,
            composed: true
        }));
        this.remove(); // Remove the room selector from the DOM
    }
}

customElements.define('irnmn-guests-selector', IRNMNGuestsSelector);
