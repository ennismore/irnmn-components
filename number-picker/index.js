import { CLASS_NAMES } from './utils/constants.js';

class IRNMNNumberPicker extends HTMLElement {
    constructor() {
        super();

        this.state = {
            count: this.getInitialValue(),
        };
    }

    connectedCallback() {
        this.setProperties();
        this.render();
        this.updateDisplay(); // this is to ensure the initial value is displayed
        this.attachEventListeners();
    }

    setProperties() {
        this.label = this.getLabel();
        this.name = this.getName();
        this.min = this.getMin();
        this.max = this.getMax();
        this.ariaLabelLess = this.getAriaLabelLess();
        this.ariaLabelMore = this.getAriaLabelMore();
    }

    /**
     * Get the label for the number input.
     * @return {String} Label or default value 'Number'.
     */
    getLabel() {
        return this.getAttribute('label') || 'Number';
    }

    /**
     * Get the aria-label for the decrement button.
     * @return {String} Aria label or default value 'Decrease value'.
     */
    getAriaLabelLess() {
        return this.getAttribute('aria-label-less') || 'Decrease value';
    }

    /**
     * Get the aria-label for the increment button.
     * @return {String} Aria label or default value 'Increase value'.
     */
    getAriaLabelMore() {
        return this.getAttribute('aria-label-more') || 'Increase value';
    }

    /**
     * Get the name.
     * @return {String} Name or default value 'count'.
     */
    getName() {
        return this.getAttribute('name') || 'count';
    }

    /**
     * Get the minimum value for the number input.
     * @return {Number} Minimum value or default value 0.
     */
    getMin() {
        return parseInt(this.getAttribute('min')) || 0;
    }

    /**
     * Get the maximum value for the number input.
     * @return {Number} Maximum value or default value 10.
     */
    getMax() {
        return parseInt(this.getAttribute('max')) || 10;
    }

    /**
     * Get the initial value for the number input.
     * Falls back to the minimum value if the initial value is not set.
     * @return {Number} Initial value or minimum value.
     */
    getInitialValue() {
        return parseInt(this.getAttribute('initial-value')) || this.getMin();
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.numberPicker}">
                <span class="${CLASS_NAMES.label}">${this.label}</span>
                <button type="button" aria-label="${this.ariaLabelLess}" class="${CLASS_NAMES.decrementBtn}">-</button>
                <span class="${CLASS_NAMES.numberValue}">${this.state.count}</span>
                <button type="button" aria-label="${this.ariaLabelMore}" class="${CLASS_NAMES.incrementBtn}">+</button>
                <input type="hidden" name="${this.name}" value="${this.state.count}">
            </div>
        `;
    }

    attachEventListeners() {
        this.querySelector(`.${CLASS_NAMES.incrementBtn}`).addEventListener(
            'click',
            () => this.updateCount(1),
        );
        this.querySelector(`.${CLASS_NAMES.decrementBtn}`).addEventListener(
            'click',
            () => this.updateCount(-1),
        );
    }

    updateCount(delta) {
        const newValue = this.state.count + delta;
        if (newValue >= this.min && newValue <= this.max) {
            this.state.count = newValue;
            this.updateDisplay();

            // Emit custom event to notify parent of the change
            this.dispatchEvent(
                new CustomEvent('valueChanged', {
                    detail: { value: this.state.count },
                    bubbles: true,
                    composed: true,
                }),
            );
        }
    }

    /**
     * Update the displayed number value.
     * This method is called whenever the count is updated.
     *
     * @return {void}
     */
    updateDisplay() {
        this.querySelector(`.${CLASS_NAMES.numberValue}`).textContent =
            this.state.count;
        this.querySelector('input[type=hidden]').value = this.state.count;
    }
}

if (!customElements.get('irnmn-number-picker')) {
    customElements.define('irnmn-number-picker', IRNMNNumberPicker);
}
