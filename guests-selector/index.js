import { CLASS_NAMES } from './utils/constants.js';

class IRNMNGuestsSelector extends HTMLElement {
    constructor() {
        super();

        const initState = this.getAttribute('init-state');
        if (initState && initState !== '' && initState !== 'false') {
            try {
                const parsedState = JSON.parse(initState);
                if (
                    parsedState.adults !== undefined &&
                    parsedState.children !== undefined &&
                    parsedState.childrenAges !== undefined
                ) {
                    this.state = parsedState;
                } else {
                    throw new Error('Missing required state properties');
                }
            } catch (e) {
                console.error(
                    'Invalid JSON string for init-state or missing properties:',
                    e,
                );
                this.state = {
                    adults: 2,
                    children: 0,
                    childrenAges: [],
                };
            }
        } else {
            this.state = {
                adults: 2,
                children: 0,
                childrenAges: [],
            };
        }
    }

    static get observedAttributes() {
        return [
            'name',
            'label',
            'max-total-guests',
            'adults-number',
            'children-number',
            'max-child-age',
            'enable-children',
            'enable-children-ages',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderGuestsSelector();
        }
    }

    renderGuestsSelector() {
        this.setProperties();
        this.updateState();
        this.render();
        this.attachEventListeners();
        this.renderChildrenAgeDropdowns();

        Promise.resolve().then(() => {
            this.updateCounterButtonsStates();
        });
    }

    connectedCallback() {
        this.renderGuestsSelector();
    }

    setProperties() {
        this.name = this.getName();
        this.label = this.getLabel();
        this.labels = this.getLabels();
        this.maxTotalGuests = this.getMaxTotalGuests();
        this.adultsNumber = this.getAdultsNumber();
        this.enableChildren = this.getEnableChildren();
        this.childrenNumber = this.getChildrenNumber();
        this.enableChildrenAges = this.getEnableChildrenAges();
        this.maxChildAge = this.getMaxChildAge();
        this.maxGuestsLabel = this.getMaxGuestsLabel();
    }

    updateState() {
        const initialState = { ...this.state };

        if (!this.enableChildren) {
            this.state.children = 0;
            this.state.childrenAges = [];
        } else if (!this.enableChildrenAges) {
            this.state.childrenAges = [];
        }

        // Ensure adults do not exceed adultsNumber
        if (this.state.adults > this.adultsNumber) {
            this.state.adults = this.adultsNumber;
        }

        // Ensure children do not exceed childrenNumber
        if (this.state.children > this.childrenNumber) {
            this.state.children = this.childrenNumber;
        }

        // Ensure total guests do not exceed maxTotalGuests
        let totalGuests = this.state.adults + this.state.children;
        if (totalGuests > this.maxTotalGuests) {
            // Reduce children first
            if (this.state.children > 0) {
                const excessChildren = totalGuests - this.maxTotalGuests;
                this.state.children = Math.max(
                    0,
                    this.state.children - excessChildren,
                );
                totalGuests = this.state.adults + this.state.children;
            }

            // If still exceeding, reduce adults
            if (totalGuests > this.maxTotalGuests) {
                this.state.adults = this.maxTotalGuests - this.state.children;
            }
        }

        // Dispatch event only if the final state is different from the initial state
        if (JSON.stringify(initialState) !== JSON.stringify(this.state)) {
            this.dispatchEvent(
                new CustomEvent('irnmn-roomValuesChange', {
                    detail: this.state,
                }),
            );
        }
    }

    /**
     * Check if children are enabled.
     * @return {Boolean} True if children are enabled, false otherwise.
     */
    getEnableChildren() {
        const enableChildrenAttr = this.getAttribute('enable-children');
        return (
            enableChildrenAttr === 'true' ||
            (enableChildrenAttr !== 'false' &&
                enableChildrenAttr !== 'null' &&
                enableChildrenAttr)
        );
    }

    /**
     * Check if child ages are enabled.
     * @return {Boolean} True if child ages are enabled, false otherwise.
     */
    getEnableChildrenAges() {
        const enableChildrenAgesAttr = this.getAttribute(
            'enable-children-ages',
        );
        return (
            enableChildrenAgesAttr === 'true' ||
            (enableChildrenAgesAttr !== 'false' &&
                enableChildrenAgesAttr !== 'null' &&
                enableChildrenAgesAttr)
        );
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
    getAdultsNumber() {
        return parseInt(this.getAttribute('adults-number')) || 5;
    }

    /**
     * Get the maximum number of children.
     * @return {Number} Max children or default value of 5.
     */
    getChildrenNumber() {
        return parseInt(this.getAttribute('children-number')) || 5;
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

    getLabels() {
        const defaultLabels = {
            room: 'Room',
            rooms: 'Rooms',
            guests: 'Guests',
            adults: 'Adults',
            children: 'Children',
            childAge: 'Child age',
            remove: 'Remove',
            ariaLabelMoreAdults: 'Add one adult',
            ariaLabelLessAdults: 'Remove one adult',
            ariaLabelMoreChildren: 'Add one child',
            ariaLabelLessChildren: 'Remove one child',
        };
        const customLabels = JSON.parse(this.getAttribute('labels')) || {};
        return { ...defaultLabels, ...customLabels };
    }

    /**
     * Get the label for the child age input.
     * @return {String} Child age label or default value 'Age'.
     */
    getChildAgeLabel() {
        return this.getAttribute('child-age-label') || 'Child age';
    }

    /**
     * Get the label for max guests if enabled
     * @return {String} Label or nothing for max guests.
     */
    getMaxGuestsLabel() {
        const enableMaxGuestsLabel = this.getAttribute(
            'enable-max-guests-label',
        );
        return enableMaxGuestsLabel == 'true'
            ? `(max ${this.maxTotalGuests} ${this.labels.guests})`
            : ``;
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomContainer}">
                <div class="${CLASS_NAMES.roomHeader}">
                    <span class="${CLASS_NAMES.roomLabel}">${this.label} ${this.maxGuestsLabel}</span>
                    <button type="button" class="${CLASS_NAMES.removeRoomBtn}">${this.labels.remove}</button>
                </div>
                <div class="${CLASS_NAMES.guestControls}">
                    <irnmn-number-picker
                        class="adult-picker"
                        label="${this.enableChildren ? this.labels.adults : this.labels.guests}"
                        name="${this.name}.adults"
                        min="1"
                        max="${this.adultsNumber ?? this.maxTotalGuests}"
                        initial-value="${this.state.adults}"
                        aria-label-more="${this.labels.ariaLabelMoreAdults}"
                        aria-label-less="${this.labels.ariaLabelLessAdults}">
                    </irnmn-number-picker>
                ${
                    this.enableChildren
                        ? `
                    <irnmn-number-picker
                        class="children-picker"
                        label="${this.labels.children}"
                        name="${this.name}.children"
                        min="0"
                        max="${this.childrenNumber ?? this.maxTotalGuests}"
                        initial-value="${this.state.children}"
                        aria-label-more="${this.labels.ariaLabelMoreChildren}"
                        aria-label-less="${this.labels.ariaLabelLessChildren}">
                    </irnmn-number-picker>
                    <div class="${CLASS_NAMES.childrenAgeDropdowns}"></div>
                `
                        : ''
                }
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const adultsPicker = this.querySelector(
            'irnmn-number-picker.adult-picker',
        );
        const childrenPicker = this.querySelector(
            'irnmn-number-picker.children-picker',
        );

        if (adultsPicker) {
            // Listen for the valueChanged event from the "Adults" picker
            adultsPicker.addEventListener('valueChanged', (e) => {
                this.state.adults = e.detail.value;
                this.updateCounterButtonsStates();
                // Emit event
                this.dispatchEvent(
                    new CustomEvent('irnmn-roomValuesChange', {
                        detail: this.state,
                    }),
                );
            });
        }

        if (childrenPicker) {
            // Listen for the valueChanged event from the "Children" picker
            childrenPicker.addEventListener('valueChanged', (e) => {
                this.state.children = e.detail.value;
                this.updateCounterButtonsStates();
                this.renderChildrenAgeDropdowns();
                // Emit event
                this.dispatchEvent(
                    new CustomEvent('irnmn-roomValuesChange', {
                        detail: this.state,
                    }),
                );
            });
        }

        this.querySelector(`.${CLASS_NAMES.removeRoomBtn}`).addEventListener(
            'click',
            () => this.removeRoom(),
        );
    }

    /**
     * Updates the states of the counter buttons based on the current number of adults and children.
     * Disables increment or decrement buttons if the limits are reached.
     */
    updateCounterButtonsStates() {
        const totalGuests = this.state.adults + this.state.children;
        let disableAdultsIncrement = false;
        let disableAdultsDecrement = false;
        let disableChildrenIncrement = false;
        let disableChildrenDecrement = false;

        // Check if adults reached max or min limit
        if (this.state.adults >= this.adultsNumber) {
            disableAdultsIncrement = true;
        } else if (this.state.adults <= 1) {
            disableAdultsDecrement = true;
        }

        // Check if children reached max or min limit
        if (this.state.children >= this.childrenNumber) {
            disableChildrenIncrement = true;
        } else if (this.state.children <= 0) {
            disableChildrenDecrement = true;
        }

        // Check if total guests reached max limit
        if (totalGuests >= this.maxTotalGuests) {
            disableAdultsIncrement = true;
            disableChildrenIncrement = true;
        }

        // Apply the final states to the buttons
        this.setButtonState(
            'incrementBtn',
            disableAdultsIncrement,
            disableChildrenIncrement,
        );
        this.setButtonState(
            'decrementBtn',
            disableAdultsDecrement,
            disableChildrenDecrement,
        );
    }

    /**
     * Sets the state of the buttons for adult and children pickers.
     *
     * @param {string} buttonType - The type of button to be targeted (e.g., 'incrementBtn', 'decrementBtn').
     * @param {boolean} [disableAdults=true] - Whether to disable the adult picker button.
     * @param {boolean} [disableChildren=true] - Whether to disable the children picker button.
     */
    setButtonState(buttonType, disableAdults = true, disableChildren = true) {
        const adultsPickerBtn = this.querySelector(
            `irnmn-number-picker.adult-picker .${CLASS_NAMES[buttonType]}`,
        );
        const childrenPickerBtn = this.querySelector(
            `irnmn-number-picker.children-picker .${CLASS_NAMES[buttonType]}`,
        );

        if (adultsPickerBtn) {
            adultsPickerBtn.disabled = disableAdults;
        }
        if (childrenPickerBtn) {
            childrenPickerBtn.disabled = disableChildren;
        }
    }

    renderChildrenAgeDropdowns() {
        if (!this.enableChildren || !this.enableChildrenAges) {
            return;
        }
        const childAgeContainer = this.querySelector(
            `.${CLASS_NAMES.childrenAgeDropdowns}`,
        );
        childAgeContainer.innerHTML = ''; // Clear existing dropdowns

        for (let i = 1; i <= this.state.children; i++) {
            const ageDropdown = document.createElement('select');
            ageDropdown.setAttribute('id', `irnmn-child-age-${i}`);
            ageDropdown.setAttribute(
                'name',
                `${this.name}.childrenAges[${i - 1}]`,
            );
            ageDropdown.innerHTML = this.generateAgeOptions(this.maxChildAge);

            // Initialize childrenAges[i - 1] to 1 if not already set
            if (!this.state.childrenAges[i - 1]) {
                this.state.childrenAges[i - 1] = 1; // Set default age to 1
            }

            ageDropdown.value = this.state.childrenAges[i - 1]; // Set the dropdown value to the initialized age

            // Dispatch event on change
            ageDropdown.addEventListener('change', () => {
                this.state.childrenAges[i - 1] = parseInt(ageDropdown.value);

                // Emit custom event with the entire childrenAges array when any child age changes
                this.dispatchEvent(
                    new CustomEvent('irnmn-roomValuesChange', {
                        detail: this.state,
                    }),
                );
            });
            // create a label for the child age select
            const label = document.createElement('label');
            label.textContent = `${this.labels.childAge} (${i})`;
            // create a wrapper for label and select
            const ageWrapper = document.createElement('div');
            ageWrapper.classList.add('irnmn-child-age-wrapper');
            ageWrapper.appendChild(label);
            // create a wrapper for label and select
            const selectWrapper = document.createElement('div');
            selectWrapper.classList.add('irnmn-child-age-select-wrapper');
            selectWrapper.appendChild(ageDropdown);
            ageWrapper.appendChild(selectWrapper);
            // append everything to the container
            childAgeContainer.appendChild(ageWrapper);

            // Emit event after adding select to the DOM (usefull for custom dropdowns)
            document.dispatchEvent(
                new CustomEvent('irnmn-initChildAgeDropdown', {
                    detail: {
                        ID: `irnmn-child-age-${i}`,
                        element: ageDropdown,
                    },
                }),
            );
        }

        // Emit event after setting default values for childrenAges
        this.dispatchEvent(
            new CustomEvent('irnmn-roomValuesChange', {
                detail: this.state,
            }),
        );
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
        this.dispatchEvent(
            new CustomEvent('irnmn-roomRemoved', {
                detail: { roomIndex: this.label },
                bubbles: true,
                composed: true,
            }),
        );
    }
}
if (!customElements.get('irnmn-guests-selector')) {
    customElements.define('irnmn-guests-selector', IRNMNGuestsSelector);
}
