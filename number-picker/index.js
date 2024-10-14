class NumberPicker extends HTMLElement {
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
            <div class="number-picker">
                <span class="number-label">${this.label}</span>
                <button type="button" class="decrement-btn">-</button>
                <span class="number-value">${this.state.count}</span>
                <button type="button" class="increment-btn">+</button>
            </div>
        `;
    }

    attachEventListeners() {
        this.querySelector('.increment-btn').addEventListener('click', () => this.updateCount(1));
        this.querySelector('.decrement-btn').addEventListener('click', () => this.updateCount(-1));
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
        this.querySelector('.number-value').textContent = this.state.count;
    }
}

customElements.define('number-picker', NumberPicker);
