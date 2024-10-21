import { 
    createMonthElement, 
    createDayButton,
    addEmptyDays
} from './utils/dom.js'; 

import { 
    getNext12Months, 
    formatDate
} from './utils/dates.js'; 

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
} from '../utils/components.js';  // Utility functions for general component behavior

class IRNMNCalendar extends HTMLElement {
    constructor() {
        super();

        this.state = {
            checkin: null,
            checkout: null,
        };

    }

    static get observedAttributes() {
        return ['open-date', 'date-locale'];  
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderCalendar();
        }
    }

    /**
     * Initialize the properties of the component
     * @return {void}
     */
    setProperties() {

        this.dayButtons = [];

        this.label = this.getAttribute('label') || 'Check-in';
        this.placeholder = this.getAttribute('placeholder') || 'Select a date';
        this.name = this.getAttribute('name') || 'irnmn-calendar';
        this.today = new Date();
        this.openDate = new Date(this.getAttribute('open-date') || Date.now());
        this.startName = this.getAttribute('checkin-date-name') || 'startDate';
        this.endName = this.getAttribute('checkout-date-name') || 'endDate';
        this.weekDays = this.getAttribute('weekdays') ? this.getAttribute('weekdays').split(',') :  false;
        this.startStorageKey = `irnmn-${this.startName}-${this.name}`;
        this.endStorageKey = `irnmn-${this.endName}-${this.name}`;
        this.dateLocale = this.getAttribute('date-locale') || 'en-gb';
    }


    /**
     * Get the label for the calendar input.
     * @return {String} Label or default value 'Check-in'.
     */
    getLabel() {
        return this.getAttribute('label') || 'Check-in';
    }

    /**
     * Get the placeholder for the calendar input.
     * @return {String} Placeholder or default value 'Select a date'.
     */
    getPlaceholder() {
        return this.getAttribute('placeholder') || 'Select a date';
    }

    /**
     * Get the name attribute for the calendar input.
     * @return {String} Name or default value 'irnmn-calendar'.
     */
    getName() {
        return this.getAttribute('name') || 'irnmn-calendar';
    }

    /**
     * Get the open date for the calendar (either from attribute or current date).
     * @return {Date} Open date or default to the current date.
     */
    getOpenDate() {
        return new Date(this.getAttribute('open-date') || Date.now());
    }

    /**
     * Get the name for the check-in date input.
     * @return {String} Start date name or default value 'startDate'.
     */
    getStartName() {
        return this.getAttribute('checkin-date-name') || 'startDate';
    }

    /**
     * Get the name for the check-out date input.
     * @return {String} End date name or default value 'endDate'.
     */
    getEndName() {
        return this.getAttribute('checkout-date-name') || 'endDate';
    }

    /**
     * Get the weekdays as an array, split by commas.
     * @return {Array|Boolean} Weekdays array or false if not provided.
     */
    getWeekDays() {
        return this.getAttribute('weekdays') ? this.getAttribute('weekdays').split(',') : false;
    }

    /**
     * Get the storage key for the start date.
     * @return {String} Start storage key formatted with the component name.
     */
    getStartStorageKey() {
        return `irnmn-${this.getStartName()}-${this.getName()}`;
    }

    /**
     * Get the storage key for the end date.
     * @return {String} End storage key formatted with the component name.
     */
    getEndStorageKey() {
        return `irnmn-${this.getEndName()}-${this.getName()}`;
    }

    /**
     * Get the locale for the date format.
     * @return {String} Date locale or default 'en-gb'.
     */
    getDateLocale() {
        return this.getAttribute('date-locale') || 'en-gb';
    }

    renderCalendar() {
        this.setProperties();
        this.verifyOpenDate();
        this.render();  
        this.loadFromSessionStorage();
    }

    async connectedCallback() {
       this.renderCalendar();
         // Load from sessionStorage and apply necessary classes

        // Listen for custom events tied to the specific "name" attribute
        document.addEventListener(`checkin-selected-${this.name}`, (e) => this.syncState(e));
        document.addEventListener(`checkout-selected-${this.name}`, (e) => this.syncState(e));
    }

    disconnectedCallback() {
        document.removeEventListener(`checkin-selected-${this.name}`, this.syncState);
        document.removeEventListener(`checkout-selected-${this.name}`, this.syncState);
    }

    render() {
        this.innerHTML = ``;
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
        this.monthsWrapper = this.createElementWithClasses('div', [CLASS_NAMES.monthsWrapper]);
        this.panel.appendChild(this.monthsWrapper);
        this.panel.style.display = 'none';  // Hide the panel by default
        this.appendChild(this.panel);
    }
    

    renderHiddenInputs() {
        this.startInput = this.createElementWithAttributes('input', { type: 'hidden', name: this.startName });
        this.endInput = this.createElementWithAttributes('input', { type: 'hidden', name: this.endName });
        this.append(this.startInput, this.endInput);
    }

    /**
     * Use Today as the minimum date for the calendar
     * @return {void}
     */
    verifyOpenDate() {

        /**
         * Prevent issues with timezone, setting the time to 00:00:00
         */
        this.today.setHours(0, 0, 0, 0);
        this.openDate.setHours(0, 0, 0, 0);

        if( this.openDate < this.today ) {
            this.openDate = this.today;
        }

    }

    loadMonthButtons() {
        const months = getNext12Months(this.openDate);
    
        months.forEach(month => {
            const monthEl = createMonthElement(month, this.weekDays, this.dateLocale);
            this.monthsWrapper.appendChild(monthEl);
    
            const daysContainer = monthEl.querySelector(`.${CLASS_NAMES.daysContainer}`);
    
            // Calculate the first day of the month and how many empty slots before Monday
            const firstDayOfMonth = new Date(month.year, month.month, 1);
            const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to make Monday = 0
    
            // Use the utility function to add empty placeholders
            addEmptyDays(daysContainer, startDay, CLASS_NAMES.emptyDay);
    
            // Render the days of the month
            month.days.forEach(day => {
                const dayBtn = createDayButton(day, this.dateLocale);

                if (day.date < this.openDate) dayBtn.disabled = true;
    
                dayBtn.addEventListener('click', (e) => this.handleDayClick(dayBtn));
                daysContainer.appendChild(dayBtn);
                this.dayButtons.push(dayBtn);
            });
        });
    }

    /**
     * Handle the click event on a day button
     * 
     * @param {HTMLButtonElement} dayBtn - The button element that was clicked
     * @return {void}
     */
    handleDayClick(dayBtn) {
        const time = parseInt(dayBtn.dataset.time);
    
        // If no check-in is set, set it
        if (!this.state.checkin) {
            this.setDate('checkin', time, dayBtn, `checkin-selected-${this.name}`);
        } 
        // If no checkout is set and the selected time is after check-in, set checkout
        else if (!this.state.checkout && time > this.state.checkin) {
            this.setDate('checkout', time, dayBtn, `checkout-selected-${this.name}`);
            this.highlightRange(this.state.checkin, this.state.checkout);
            this.toggleCalendar();
        } 
        // Otherwise, reset and set a new check-in
        else {
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
        const checkinDate = new Date(this.state.checkin);
        const checkoutDate = new Date(this.state.checkout);
    
        this.inputElement.value = `${formatDate(checkinDate, this.dateLocale)} - ${formatDate(checkoutDate, this.dateLocale)}`;
        this.startInput.value = checkinDate.toISOString();  // Save as ISO string
        this.endInput.value = checkoutDate.toISOString();   // Save as ISO string
    
        saveToSessionStorage(this.startStorageKey, this.startInput.value);
        saveToSessionStorage(this.endStorageKey, this.endInput.value);
    }
    

    setSingleInputField() {
        const checkinDate = new Date(this.state.checkin);
    
        this.inputElement.value = formatDate(checkinDate, this.dateLocale);
        this.startInput.value = checkinDate.toISOString();  // Save as ISO string
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
        if (event.key === 'Escape') toggleVisibility(this.panel, false);
    }

    /**
     * Load the date from sessionStorage and set the input field
     * @param {String} storedDate - The date stored in sessionStorage
     * @param {String} stateKey - The key in the state object
     * @param {HTMLInputElement} inputElement - The input element to set the value
     * @return {void}
     */
    setDateFromStorage(storedDate, stateKey, inputElement) {
        if (storedDate) {
            this.state[stateKey] = new Date(storedDate).getTime();  // Convert ISO string to timestamp
            inputElement.value = formatDate(new Date(this.state[stateKey]), this.dateLocale);
        }
    }

    loadFromSessionStorage() {
        const storedCheckin = getFromSessionStorage(this.startStorageKey);
        const storedCheckout = getFromSessionStorage(this.endStorageKey);

        this.setDateFromStorage(storedCheckin, 'checkin', this.startInput);
        this.setDateFromStorage(storedCheckout, 'checkout', this.endInput);

        // Display the date range in the input field
        if (this.state.checkin && this.state.checkout) {
            this.inputElement.value = `${this.startInput.value} - ${this.endInput.value}`;
        } else if (this.state.checkin) {
            this.inputElement.value = this.startInput.value;
        }

        this.applyHighlights();  // Apply the saved highlights to the calendar
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
