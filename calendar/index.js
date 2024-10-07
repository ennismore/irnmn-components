import { 
    createMonthElement, 
    createDayButton, 
    toggleElementDisplay 
} from './utils/domUtils.js'; 

import { 
    getNext12Months, 
    formatDate 
} from './utils/dateUtils.js'; 

import { CLASS_NAMES } from './utils/constants.js';  

import { 
    dispatchSyncEvent, 
    handleSyncEvent, 
    saveToSessionStorage, 
    getFromSessionStorage, 
    clearSessionData, 
    toggleVisibility, 
    highlightButton, 
    clearHighlights 
} from '../utils/componentsUtils.js';  // Utility functions for general component behavior

class IRNMNCalendar extends HTMLElement {
    constructor() {
        super();
        this.label = this.getAttribute('label') || 'Check-in';
        this.placeholder = this.getAttribute('placeholder') || 'Select a date';
        this.name = this.getAttribute('name') || 'irnmn-calendar';  
        this.openDate = new Date(this.getAttribute('openDate') || Date.now());
        this.startName = this.getAttribute('checkin-date-name') || 'startDate';
        this.endName = this.getAttribute('checkout-date-name') || 'endDate';

        this.startStorageKey = `irnmn-${this.startName}-${this.name}`;
        this.endStorageKey = `irnmn-${this.endName}-${this.name}`;

        this.state = {
            checkin: null,
            checkout: null,
        };

        this.dayButtons = [];
    }

    connectedCallback() {
        this.render();
        this.loadFromSessionStorage();

        // Listen for custom events tied to the specific "name" attribute
        document.addEventListener(`checkin-selected-${this.name}`, (e) => this.syncState(e));
        document.addEventListener(`checkout-selected-${this.name}`, (e) => this.syncState(e));
    }

    disconnectedCallback() {
        document.removeEventListener(`checkin-selected-${this.name}`, this.syncState);
        document.removeEventListener(`checkout-selected-${this.name}`, this.syncState);
    }

    render() {
        this.innerHTML = '';  // Clear previous content
        this.renderInputGroup();
        this.renderCalendarPanel();
        this.renderHiddenInputs();
        this.loadMonthButtons();
    }

    renderInputGroup() {
        const inputGroup = this.createElementWithClasses('div', [CLASS_NAMES.inputGroup]);
        const labelElement = this.createElementWithText('label', this.label);
        const input = this.createElementWithAttributes('input', { type: 'text', placeholder: this.placeholder, readOnly: true });

        this.inputElement = input;  // Store input for future use
        inputGroup.append(labelElement, input);
        inputGroup.addEventListener('click', () => this.toggleCalendar());
        this.appendChild(inputGroup);
    }

    renderCalendarPanel() {
        this.panel = this.createElementWithClasses('div', [CLASS_NAMES.panel]);
        this.panel.style.display = 'none';  // Initially hide
        const resetBtn = this.createElementWithText('button', 'Reset Dates', [CLASS_NAMES.resetBtn]);

        resetBtn.addEventListener('click', () => this.resetDates());
        this.panel.appendChild(resetBtn);
        this.appendChild(this.panel);
    }

    renderHiddenInputs() {
        this.startInput = this.createElementWithAttributes('input', { type: 'hidden', name: this.startName });
        this.endInput = this.createElementWithAttributes('input', { type: 'hidden', name: this.endName });
        this.append(this.startInput, this.endInput);
    }

    loadMonthButtons() {
        const months = getNext12Months(this.openDate);
        months.forEach(month => {
            const monthEl = createMonthElement(month);
            this.panel.appendChild(monthEl);

            month.days.forEach(day => {
                const dayBtn = createDayButton(day);
                if (day.date < this.openDate) dayBtn.disabled = true;

                dayBtn.addEventListener('click', (e) => this.handleDayClick(e, dayBtn));
                monthEl.querySelector(`.${CLASS_NAMES.daysContainer}`).appendChild(dayBtn);
                this.dayButtons.push(dayBtn);
            });
        });
    }

    handleDayClick(event, dayBtn) {
        const time = parseInt(dayBtn.dataset.time);

        if (!this.state.checkin) {
            this.setDate('checkin', time, dayBtn, `checkin-selected-${this.name}`);
        } else if (!this.state.checkout && time > this.state.checkin) {
            this.setDate('checkout', time, dayBtn, `checkout-selected-${this.name}`);
            this.highlightRange(this.state.checkin, this.state.checkout);
            this.toggleCalendar();
        } else {
            this.resetDates();
            this.setDate('checkin', time, dayBtn, `checkin-selected-${this.name}`);
        }
        this.updateInputField();
    }

    setDate(type, time, dayBtn, eventName) {
        this.state[type] = time;
        highlightButton(dayBtn, CLASS_NAMES[type]);  // Use utility to highlight
        dispatchSyncEvent(eventName, { checkin: this.state.checkin, checkout: this.state.checkout });
    }

    syncState(event) {
        handleSyncEvent(event, this.state, (newState) => {
            this.state = newState;
            this.updateInputField();
            clearHighlights(this.dayButtons, [CLASS_NAMES.checkin, CLASS_NAMES.checkout, CLASS_NAMES.inRange]);
            this.applyHighlights();
        });
    }

    applyHighlights() {
        if (this.state.checkin) {
            this.highlightDayForTime(this.state.checkin, CLASS_NAMES.checkin);
        }

        if (this.state.checkout) {
            this.highlightDayForTime(this.state.checkout, CLASS_NAMES.checkout);
            this.highlightRange(this.state.checkin, this.state.checkout);
        }
    }

    updateInputField(reset = false) {
        if (reset) {
            this.clearInputFields();
            clearSessionData(this.startStorageKey, this.endStorageKey);
        } else if (this.state.checkin && this.state.checkout) {
            this.setRangeInputFields();
        } else if (this.state.checkin) {
            this.setSingleInputField();
        }
    }

    setRangeInputFields() {
        const checkinDate = formatDate(new Date(this.state.checkin));
        const checkoutDate = formatDate(new Date(this.state.checkout));

        this.inputElement.value = `${checkinDate} - ${checkoutDate}`;
        this.startInput.value = checkinDate;
        this.endInput.value = checkoutDate;
        saveToSessionStorage(this.startStorageKey, this.startInput.value);
        saveToSessionStorage(this.endStorageKey, this.endInput.value);
    }

    setSingleInputField() {
        const checkinDate = formatDate(new Date(this.state.checkin));

        this.inputElement.value = checkinDate;
        this.startInput.value = checkinDate;
        this.endInput.value = '';
        saveToSessionStorage(this.startStorageKey, this.startInput.value);
        clearSessionData(this.endStorageKey);
    }

    clearInputFields() {
        this.inputElement.value = '';
        this.startInput.value = '';
        this.endInput.value = '';
    }

    resetDates() {
        this.state.checkin = null;
        this.state.checkout = null;
        clearHighlights(this.dayButtons, [CLASS_NAMES.checkin, CLASS_NAMES.checkout, CLASS_NAMES.inRange]);
        this.updateInputField(true);
    }

    highlightDayForTime(time, className) {
        const dayButton = this.dayButtons.find(button => parseInt(button.dataset.time) === time);
        if (dayButton) highlightButton(dayButton, className);
    }

    highlightRange(startTime, endTime) {
        this.dayButtons.forEach(button => {
            const time = parseInt(button.dataset.time);
            if (time > startTime && time < endTime) {
                highlightButton(button, CLASS_NAMES.inRange);
            }
        });
    }

    toggleCalendar() {
        this.calendarVisible = !this.calendarVisible;
        toggleVisibility(this.panel, this.calendarVisible);

        if (this.calendarVisible) {
            document.addEventListener('keydown', this.handleEscKey.bind(this));
        } else {
            document.removeEventListener('keydown', this.handleEscKey.bind(this));
        }
    }

    handleEscKey(event) {
        if (event.key === 'Escape') this.toggleCalendar();
    }

    loadFromSessionStorage() {
        const storedCheckin = getFromSessionStorage(this.startStorageKey);
        const storedCheckout = getFromSessionStorage(this.endStorageKey);

        if (storedCheckin) {
            this.state.checkin = new Date(storedCheckin).getTime();
            this.startInput.value = storedCheckin;
            this.inputElement.value = storedCheckin;
        }

        if (storedCheckout) {
            this.state.checkout = new Date(storedCheckout).getTime();
            this.endInput.value = storedCheckout;
            this.inputElement.value = `${storedCheckin} - ${storedCheckout}`;
        }

        this.applyHighlights();  // Apply the saved highlights
    }

    createElementWithClasses(tag, classNames = []) {
        const element = document.createElement(tag);
        classNames.forEach(className => element.classList.add(className));
        return element;
    }

    createElementWithText(tag, text, classNames = []) {
        const element = this.createElementWithClasses(tag, classNames);
        element.textContent = text;
        return element;
    }

    createElementWithAttributes(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
        return element;
    }
}

customElements.define('irnmn-calendar', IRNMNCalendar);
