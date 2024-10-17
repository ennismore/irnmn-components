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
            <div class="room-container">
                <div class="room-header">
                    <span>${this.label} (max ${this.maxTotalGuests} guests)</span>
                    <button type="button" class="remove-room">Remove</button>
                </div>
                <div class="guest-controls">
                    <number-picker label="Adults" min="0" max="${this.maxAdults}" initialValue="0"></number-picker>
                    <number-picker label="Children" min="0" max="${this.maxChildren}" initialValue="0"></number-picker>
                    <div class="children-age-dropdown" id="children-age-container"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Listen for the valueChanged event from the "Adults" picker
        this.querySelector('number-picker[label="Adults"]').addEventListener('valueChanged', (e) => {
            this.state.adults = e.detail.value;
            this.updateTotalGuests();
            this.updateDisplay(); // Call updateDisplay to reflect changes
        });

        // Listen for the valueChanged event from the "Children" picker
        this.querySelector('number-picker[label="Children"]').addEventListener('valueChanged', (e) => {
            this.state.children = e.detail.value;
            this.updateTotalGuests();
            this.renderChildrenAgeDropdown();
            this.updateDisplay(); // Call updateDisplay to reflect changes
        });

        this.querySelector('.remove-room').addEventListener('click', () => this.removeRoom());
    }

    updateTotalGuests() {
        const totalGuests = this.state.adults + this.state.children;
        if (totalGuests > this.maxTotalGuests) {
            alert(`Max total guests (${this.maxTotalGuests}) exceeded!`);
        }
    }

    updateDisplay() {
        // Updates the displayed values for adults and children
        this.querySelector('number-picker[label="Adults"] .number-value').textContent = this.state.adults;
        this.querySelector('number-picker[label="Children"] .number-value').textContent = this.state.children;
    }

    renderChildrenAgeDropdown() {
        const container = this.querySelector('#children-age-container');
        container.innerHTML = ''; // Clear previous dropdowns

        for (let i = 0; i < this.state.children; i++) {
            const select = document.createElement('select');
            select.classList.add('child-age-dropdown');
            for (let age = 0; age <= this.maxChildAge; age++) {
                const option = document.createElement('option');
                option.value = age;
                option.text = age === 0 ? 'Age' : age;
                select.appendChild(option);
            }
            container.appendChild(select);
        }
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
