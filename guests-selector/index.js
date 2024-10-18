import { CLASS_NAMES } from './utils/constants.js';

class IRNMNGuestsSelector extends HTMLElement {
    constructor() {
        super();
        this.maxTotalGuests = parseInt(this.getAttribute('max-total-guests')) || 5;
        this.maxAdults = parseInt(this.getAttribute('max-adults')) || 5;
        this.maxChildren = parseInt(this.getAttribute('max-children')) || 5;
        this.maxChildAge = parseInt(this.getAttribute('max-child-age')) || 17;
        this.label = this.getAttribute('label') || 'Room';

        this.state = {
            adults: 0,
            children: 0,
        };
    }

    connectedCallback() {
        this.render();
        this.updateDisplay();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomContainer}">
                <div class="${CLASS_NAMES.roomHeader}">
                    <span class="${CLASS_NAMES.roomLabel}">${this.label} (max ${this.maxTotalGuests} guests)</span>
                    <button type="button" class="${CLASS_NAMES.removeRoomBtn}">Remove</button>
                </div>
                <div class="${CLASS_NAMES.guestControls}">
                    <irnmn-number-picker label="Adults" min="1" max="${this.maxAdults ?? this.maxTotalGuests}" initialValue="0"></irnmn-number-picker>
                    <irnmn-number-picker label="Children" min="0" max="${this.maxChildren ?? this.maxTotalGuests}" initialValue="0"></irnmn-number-picker>
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
