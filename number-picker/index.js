import { CLASS_NAMES } from './utils/constants.js';

class IRNMNNumberPicker extends HTMLElement {
    constructor() {
        super();
        this.label = this.getAttribute('label') || 'Number';
        this.min = parseInt(this.getAttribute('min')) || 0;
        this.max = parseInt(this.getAttribute('max')) || 10;
        this.value = parseInt(this.getAttribute('initialValue')) || this.min;

        this.state = {
            count: this.value
        };
    }

    connectedCallback() {
        this.render();
        this.updateDisplay();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.numberPicker}">
                <span class="${CLASS_NAMES.label}">${this.label}</span>
                <button type="button" class="${CLASS_NAMES.decrementBtn}">-</button>
                <span class="${CLASS_NAMES.numberValue}">${this.state.count}</span>
                <button type="button" class="${CLASS_NAMES.incrementBtn}">+</button>
            </div>
        `;
    }

    attachEventListeners() {
        this.querySelector(`.${CLASS_NAMES.incrementBtn}`).addEventListener('click', () => this.updateCount(1));
        this.querySelector(`.${CLASS_NAMES.decrementBtn}`).addEventListener('click', () => this.updateCount(-1));
    }

    updateCount(delta) {
        const newValue = this.state.count + delta;

        if (newValue >= this.min && newValue <= this.max) {
            this.state.count = newValue;
            this.updateDisplay();

            // Emit custom event to notify parent of the change
            this.dispatchEvent(new CustomEvent('valueChanged', {
                detail: { value: this.state.count },
                bubbles: true,
                composed: true
            }));
        }
    }

    updateDisplay() {
        this.querySelector(`.${CLASS_NAMES.numberValue}`).textContent = this.state.count;
    }
}

customElements.define('irnmn-number-picker', IRNMNNumberPicker);
