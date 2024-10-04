import { createMonthElement, createDayButton, toggleElementDisplay } from './utils/domUtils.js';
import { getNext12Months, formatDate } from './utils/dateUtils.js';
import { CLASS_NAMES } from './utils/constants.js';
import { saveToSessionStorage, getFromSessionStorage, clearSessionData } from '../utils/sessionStorage.js';

class IRNMNCalendar extends HTMLElement {
    constructor() {
        super();
        this.label = this.getAttribute('label') || 'Check-in';
        this.placeholder = this.getAttribute('placeholder') || 'Select a date';
        this.openDate = new Date(this.getAttribute('openDate') || Date.now());
        this.checkin = null;
        this.checkout = null;
        this.calendarVisible = false;
        this.dayButtons = [];

        // Get custom names for hidden input fields or set default ones
        this.startName = this.getAttribute('checkin-date-name') || 'startDate';
        this.endName = this.getAttribute('checkout-date-name') || 'endDate';

        // SessionStorage keys based on input names
        this.startStorageKey = `irnmn-${this.startName}`;
        this.endStorageKey = `irnmn-${this.endName}`;

        // Bind event handlers
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.resetDates = this.resetDates.bind(this); 
        this.handleEscKey = this.handleEscKey.bind(this); 
    }

    connectedCallback() {
        this.render();
        this.loadFromSessionStorage(); // Load sessionStorage values when component is connected
    }

    disconnectedCallback() {
        this.removeListeners();
    }

    render() {
        this.innerHTML = ''; // Clear previous content

        this.panel = document.createElement('div');
        this.panel.classList.add(CLASS_NAMES.panel);
        this.appendChild(this.panel);

        this.panel.style.display = 'none'; // Hide initially

        const inputGroup = document.createElement('div');
        inputGroup.classList.add(CLASS_NAMES.inputGroup);

        const labelElement = document.createElement('label');
        labelElement.textContent = this.label;
        inputGroup.appendChild(labelElement);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = this.placeholder;
        input.readOnly = true;
        this.inputElement = input; // Store input for later use
        inputGroup.appendChild(input);

        this.appendChild(inputGroup);

        inputGroup.addEventListener('click', this.toggleCalendar);

        // Create hidden inputs for check-in and check-out dates
        this.startInput = document.createElement('input');
        this.startInput.type = 'hidden';
        this.startInput.name = this.startName;
        this.appendChild(this.startInput);

        this.endInput = document.createElement('input');
        this.endInput.type = 'hidden';
        this.endInput.name = this.endName;
        this.appendChild(this.endInput);

        // Add the "Reset Dates" button inside the panel, before the months
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Dates';
        resetBtn.classList.add(CLASS_NAMES.resetBtn);
        this.panel.appendChild(resetBtn); 
        resetBtn.addEventListener('click', this.resetDates); 

        // Generate the next 12 months based on openDate
        const months = getNext12Months(this.openDate);
        months.forEach(month => {
            const monthEl = createMonthElement(month);
            this.panel.appendChild(monthEl);

            month.days.forEach(day => {
                const dayBtn = createDayButton(day);
                if (day.date < this.openDate) dayBtn.disabled = true;
                dayBtn.addEventListener('click', this.handleDayClick);
                monthEl.querySelector(`.${CLASS_NAMES.daysContainer}`).appendChild(dayBtn);

                // Store the button reference in the dayButtons array
                this.dayButtons.push(dayBtn);
            });
        });
    }

    /**
     * Remove event listeners when the component is removed from the DOM
     * (prevent memory leaks)
     * 
     */
    toggleCalendar() {
        this.calendarVisible = !this.calendarVisible;
        toggleElementDisplay(this.panel, this.calendarVisible);

        // If the calendar is now visible, listen for the ESC key
        if (this.calendarVisible) {
            document.addEventListener('keydown', this.handleEscKey);
        } else {
            document.removeEventListener('keydown', this.handleEscKey);
        }
    }

    handleEscKey(event) {
        if (event.key === 'Escape') {
            this.toggleCalendar(); // Close the calendar if ESC is pressed
        }
    }

    handleDayClick(event) {
        const dayBtn = event.target;
        const time = parseInt(dayBtn.dataset.time);
    
        // If no check-in date is selected, set the check-in date
        if (!this.checkin) {
            this.checkin = time;
        }
    
        // If check-in is selected and the time is valid for check-out, set check-out
        else if (!this.checkout && time > this.checkin) {
            this.checkout = time;
            this.highlightDay(dayBtn, CLASS_NAMES.checkout);
            this.highlightRange(this.checkin, this.checkout);
            this.toggleCalendar(); // Close calendar after selection
        }
    
        // If both dates are selected or invalid selection, reset and set check-in
        else {
            this.resetDates();
            this.checkin = time;
        }
    
        this.highlightDay(dayBtn, CLASS_NAMES.checkin);
        this.updateInputField();
    }

    /**
     * Highlight selected day
     * 
     * @param {HTMLElement} dayBtn - The day button to highlight
     * @param {string} className - The class name to add to the button
     * 
     * @returns {void}
     */
    highlightDay(dayBtn, className) {
        this.clearHighlights();
        dayBtn.classList.add(className);
    }

    /**
     * Highlight the range between check-in and check-out dates
     * 
     * @param {number} startTime - The check-in date
     * @param {number} endTime - The check-out date
     * 
     * @returns {void}
     */
    highlightRange(startTime, endTime) {
        this.dayButtons.forEach(button => {
            const time = parseInt(button.dataset.time);
            if (time > startTime && time < endTime) {
                button.classList.add(CLASS_NAMES.inRange);
            }
        });
    }

    clearHighlights() {
        this.dayButtons.forEach(button => {
            button.classList.remove(CLASS_NAMES.checkin, CLASS_NAMES.checkout, CLASS_NAMES.inRange);
        });
    }

    /**
     * Handle Reset Dates button click: clear selected dates and input fields
     * 
     * @returns {void}
     */
    resetDates() {
        this.checkin = null;
        this.checkout = null;
        this.clearHighlights();
        this.updateInputField(true);
    }


    updateInputField(reset = false) {
        if (reset) {
            this.inputElement.value = '';
            this.startInput.value = ''; 
            this.endInput.value = '';

            // Clear sessionStorage
            clearSessionData(this.startStorageKey, this.endStorageKey);
        } else if (this.checkin && this.checkout) {
            const checkinDate = new Date(this.checkin);
            const checkoutDate = new Date(this.checkout);
            this.inputElement.value = `${formatDate(checkinDate)} - ${formatDate(checkoutDate)}`;
            this.startInput.value = formatDate(checkinDate); 
            this.endInput.value = formatDate(checkoutDate);  

            // Save dates to sessionStorage
            saveToSessionStorage(this.startStorageKey, this.startInput.value);
            saveToSessionStorage(this.endStorageKey, this.endInput.value);
        } else if (this.checkin) {
            const checkinDate = new Date(this.checkin);
            this.inputElement.value = formatDate(checkinDate);
            this.startInput.value = formatDate(checkinDate); 
            this.endInput.value = ''; 

            // Save check-in date to sessionStorage
            saveToSessionStorage(this.startStorageKey, this.startInput.value);
            clearSessionData(this.endStorageKey); // Clear check-out from sessionStorage
        }
    }

    /**
     * Check for possible saved dates in sessionStorage and update the input fields
     * 
     * @returns {void}
     */
    loadFromSessionStorage() {
        const storedCheckin = getFromSessionStorage(this.startStorageKey);
        const storedCheckout = getFromSessionStorage(this.endStorageKey);

        if (storedCheckin) {
            const checkinDate = new Date(storedCheckin);
            this.checkin = checkinDate.getTime(); 
            this.startInput.value = storedCheckin;
            this.inputElement.value = storedCheckin; 
        }

        if (storedCheckout) {
            const checkoutDate = new Date(storedCheckout);
            this.checkout = checkoutDate.getTime(); 
            this.endInput.value = storedCheckout;

            // Update the input field to show the range
            this.inputElement.value = `${storedCheckin} - ${storedCheckout}`;
        }
    }
}

customElements.define('irnmn-calendar', IRNMNCalendar);
