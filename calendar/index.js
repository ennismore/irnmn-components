import {
    createMonthElement,
    createDayButton,
    addEmptyDays,
} from './utils/dom.js';

import {
    getNext12Months,
    formatDate,
    formatDateToLocale,
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
    clearHighlights,
} from '../utils/components.js'; // Utility functions for general component behavior

class IRNMNCalendar extends HTMLElement {
    constructor() {
        super();

        this.state = {
            checkin: null,
            checkout: null,
        };
    }

    static get observedAttributes() {
        return ['opening-date', 'date-locale', 'show-error'];
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

        this.label = this.getLabel();
        this.placeholder = this.getPlaceholder();
        this.name = this.getName();
        this.today = this.getToday();
        this.openingDate = this.getOpeningDate();
        this.startName = this.getStartName();
        this.endName = this.getEndName();
        this.weekDays = this.getWeekDays();
        this.startStorageKey = this.getStartStorageKey();
        this.endStorageKey = this.getEndStorageKey();
        this.dateLocale = this.getDateLocale();
        this.showError = this.getShowError();
        this.errorMessage = this.getErrorMessage();
        this.formatDateValues = this.getFormatDateValues();
    }

    get weekdayFormat() {
        return this.getAttribute('weekday-format') || '';
    }

    get dayFormat() {
        return this.getAttribute('day-format') || '2-digit';
    }

    get monthFormat() {
        return this.getAttribute('month-format') || 'short';
    }

    /**
     * Get the current date
     */
    getToday() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
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
     * Verify if the openingDate has already passed, if so, default to the current date.
     * @return {Date} Open date or default to the current date.
     */
    getOpeningDate() {
        let openingDateAttr = this.getAttribute('opening-date');
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(openingDateAttr);

        if (!openingDateAttr || !isValidDate) {
            return this.today;
        }

        const openingDate = new Date(openingDateAttr);
        openingDate.setHours(0, 0, 0, 0);

        // Return the current date if the opening date has already passed
        return openingDate > this.today ? openingDate : this.today;
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
        return this.getAttribute('weekdays')
            ? this.getAttribute('weekdays').split(',')
            : false;
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

    /**
     * Get the date format values.
     * @return {String} Date format or default 'YYYY-MM-DD'.
     */
    getFormatDateValues() {
        return this.getAttribute('format-date-values') || 'YYYY-MM-DD';
    }

    /**
     * Get the show error attribute.
     * @return {Boolean} Show error or default value false.
     */
    getShowError() {
        return (
            this.hasAttribute('show-error') &&
            this.getAttribute('show-error') === 'true'
        );
    }

    /**
     * Get the error message to display when an error occurs.
     * @return {String} Error message or default value 'An error occurred'.
     */
    getErrorMessage() {
        return this.getAttribute('error-message') || 'This field is required';
    }

    renderCalendar() {
        this.setProperties();
        this.render();
        this.loadFromSessionStorage();

        /**
         * Dispatch the custom event only when the calendar is loaded
         * and all the methods above have been executed
         */
        Promise.resolve().then(() => {
            this.dispatchEvent(
                new CustomEvent('irnmn-calendar-loaded', {
                    detail: { panel: this.panel },
                }),
            );
        });
    }

    async connectedCallback() {
        this.renderCalendar();

        this.bindKeyboardEvents();
        this.bindClickOutside();

        // Listen for custom events tied to the specific "name" attribute
        document.addEventListener(`checkin-selected-${this.name}`, (e) =>
            this.syncState(e),
        );
        document.addEventListener(`checkout-selected-${this.name}`, (e) =>
            this.syncState(e),
        );
    }

    disconnectedCallback() {
        document.removeEventListener(
            `checkin-selected-${this.name}`,
            this.syncState,
        );
        document.removeEventListener(
            `checkout-selected-${this.name}`,
            this.syncState,
        );
    }

    render() {
        this.innerHTML = ``;
        this.renderInputGroup();
        this.renderCalendarPanel();
        this.renderHiddenInputs();
        this.loadMonthButtons();
        this.renderErrorMessage();
    }

    renderInputGroup() {
        const inputGroup = this.createElementWithClasses('div', [
            CLASS_NAMES.inputGroup,
        ]);
        const labelElement = this.createElementWithText('label', this.label);
        const input = this.createElementWithAttributes('input', {
            type: 'text',
            placeholder: this.placeholder,
            readOnly: true,
        });

        this.inputElement = input; // Store input for future use
        inputGroup.append(labelElement, input);
        inputGroup.addEventListener('click', () => this.toggleCalendar());
        this.appendChild(inputGroup);
    }

    renderCalendarPanel() {
        this.panel = this.createElementWithClasses('div', [CLASS_NAMES.panel]);
        this.monthsWrapper = this.createElementWithClasses('div', [
            CLASS_NAMES.monthsWrapper,
        ]);
        this.panel.appendChild(this.monthsWrapper);
        this.panel.style.display = 'none'; // Hide the panel by default
        this.appendChild(this.panel);
    }

    renderHiddenInputs() {
        this.startInput = this.createElementWithAttributes('input', {
            type: 'hidden',
            name: this.startName,
            required: 'required',
        });
        this.endInput = this.createElementWithAttributes('input', {
            type: 'hidden',
            name: this.endName,
            required: 'required',
        });
        this.append(this.startInput, this.endInput);
    }

    renderErrorMessage() {
        if (this.showError) {
            this.errorMessageElement = this.createElementWithClasses('div', [
                CLASS_NAMES.errorMessage,
            ]);
            this.errorMessageElement.textContent = this.errorMessage;
            this.appendChild(this.errorMessageElement);
        } else {
            this.querySelector(`.${CLASS_NAMES.errorMessage}`)?.remove();
        }
    }

    loadMonthButtons() {
        const months = getNext12Months(this.openingDate);

        months.forEach((month) => {
            // Create and render the entire month (days + placeholders)
            const monthEl = createMonthElement(
                month,
                this.weekDays,
                this.dateLocale,
            );

            // Append the rendered month element to the calendar
            this.monthsWrapper.appendChild(monthEl);

            // Attach event listeners to all rendered day buttons
            const dayButtons = monthEl.querySelectorAll(
                `.${CLASS_NAMES.dayBtn}`,
            );
            dayButtons.forEach((dayBtn) => {
                const time = parseInt(dayBtn.dataset.time);

                if (time < this.openingDate.getTime()) {
                    dayBtn.disabled = true; // Disable past dates
                }

                dayBtn.addEventListener('click', () =>
                    this.handleDayClick(dayBtn),
                );
                dayBtn.addEventListener('mouseover', () => {
                    if (this.state.checkin && !this.state.checkout) {
                        clearHighlights(this.dayButtons, [CLASS_NAMES.inRange]);
                        this.highlightRange(this.state.checkin, time);
                    }
                });
                dayBtn.addEventListener('focus', () => {
                    if (this.state.checkin && !this.state.checkout) {
                        clearHighlights(this.dayButtons, [CLASS_NAMES.inRange]);
                        this.highlightRange(this.state.checkin, time);
                    }
                });

                // Track the button for state management
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

        switch (true) {
            // If no check-in is set, set it
            case !this.state.checkin:
                this.setDate(
                    'checkin',
                    time,
                    dayBtn,
                    `checkin-selected-${this.name}`,
                );
                this.highlightRange(this.state.checkin, this.state.checkin);
                break;

            // If no checkout is set and the selected time is after check-in, set checkout
            case !this.state.checkout && time > this.state.checkin:
                this.setDate(
                    'checkout',
                    time,
                    dayBtn,
                    `checkout-selected-${this.name}`,
                );
                this.highlightRange(this.state.checkin, this.state.checkout);
                this.toggleCalendar();
                break;

            // Otherwise, reset and set a new check-in
            default:
                this.resetDates();
                this.setDate(
                    'checkin',
                    time,
                    dayBtn,
                    `checkin-selected-${this.name}`,
                );
                this.highlightRange(this.state.checkin, this.state.checkin);
                break;
        }

        this.updateInputField();
    }

    setDate(type, time, dayBtn, eventName) {
        this.state[type] = time;
        highlightButton(dayBtn, CLASS_NAMES[type]); // Use utility to highlight
        dispatchSyncEvent(eventName, {
            checkin: this.state.checkin,
            checkout: this.state.checkout,
        });
    }

    syncState(event) {
        handleSyncEvent(event, this.state, (newState) => {
            this.state = newState;
            this.updateInputField();
            clearHighlights(this.dayButtons, [
                CLASS_NAMES.checkin,
                CLASS_NAMES.checkout,
                CLASS_NAMES.inRange,
                CLASS_NAMES.isSingle,
            ]);
            this.applyHighlights();
        });
    }

    applyHighlights() {
        if (this.state.checkin) {
            this.highlightDayForTime(this.state.checkin, CLASS_NAMES.checkin);
            this.highlightRange(this.state.checkin, this.state.checkin);
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
            this.setAttribute('show-error', 'false'); // Clear error message when valid location is selected
        } else if (this.state.checkin) {
            this.setSingleInputField();
        }
    }

    /**
     * Format a date range as a string in the requested format
     *
     * @param {Date} checkinDate The check-in date
     * @param {Date} checkoutDate The check-out date
     * @return {String} The formatted date range
     */
    formatDateRange(checkinDate, checkoutDate) {
        const formattedCheckinDate = formatDateToLocale(
            checkinDate,
            this.dateLocale,
            this.weekdayFormat,
            this.dayFormat,
            this.monthFormat,
        );
        const formattedCheckoutDate = formatDateToLocale(
            checkoutDate,
            this.dateLocale,
            this.weekdayFormat,
            this.dayFormat,
            this.monthFormat,
        );

        return `${formattedCheckinDate} - ${formattedCheckoutDate}`;
    }

    setRangeInputFields() {
        const checkinDate = new Date(this.state.checkin) ?? null;
        const checkoutDate = new Date(this.state.checkout) ?? null;

        if (checkinDate === null || checkoutDate === null) return;

        this.inputElement.value = this.formatDateRange(
            checkinDate,
            checkoutDate,
        );
        this.startInput.value = formatDate(checkinDate, this.formatDateValues); // Save in provided format
        this.endInput.value = formatDate(checkoutDate, this.formatDateValues); // Save in provided format

        saveToSessionStorage(this.startStorageKey, this.startInput.value);
        saveToSessionStorage(
            `${this.startStorageKey}-iso`,
            checkinDate.toISOString(),
        );
        saveToSessionStorage(this.endStorageKey, this.endInput.value);
        saveToSessionStorage(
            `${this.endStorageKey}-iso`,
            checkoutDate.toISOString(),
        );
    }

    setSingleInputField() {
        const checkinDate = new Date(this.state.checkin);

        this.inputElement.value = formatDateToLocale(
            checkinDate,
            this.dateLocale,
            this.weekdayFormat,
            this.dayFormat,
            this.monthFormat,
        );
        this.startInput.value = formatDate(checkinDate, this.formatDateValues); // Save in provided format
        this.endInput.value = '';

        saveToSessionStorage(this.startStorageKey, this.startInput.value);
        saveToSessionStorage(
            `${this.startStorageKey}-iso`,
            checkinDate.toISOString(),
        );
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
        clearHighlights(this.dayButtons, [
            CLASS_NAMES.checkin,
            CLASS_NAMES.checkout,
            CLASS_NAMES.inRange,
            CLASS_NAMES.isSingle,
        ]);
        this.updateInputField(true);
    }

    highlightDayForTime(time, className) {
        const dayButton = this.dayButtons.find(
            (button) => parseInt(button.dataset.time) === time,
        );
        if (dayButton) highlightButton(dayButton, className);
    }

    highlightRange(startTime, endTime) {
        this.dayButtons.forEach((button) => {
            const time = parseInt(button.dataset.time);
            if (time > startTime && time < endTime) {
                highlightButton(button, CLASS_NAMES.inRange);
            }
        });
        // highlight the check-in button as a single date if endTime is less than startTime
        const isSingle = startTime < endTime;
        const checkinButton = this.dayButtons.find((button) =>
            button.classList.contains(CLASS_NAMES.checkin),
        );
        if (!checkinButton) {
            return;
        }
        checkinButton.classList.toggle(CLASS_NAMES.isSingle, !isSingle);
    }

    toggleCalendar() {
        this.calendarVisible = !this.calendarVisible;
        toggleVisibility(this.panel, this.calendarVisible);

        if (this.calendarVisible) {
            this.determineRenderPosition();
            document.addEventListener('keydown', this.handleEscKey.bind(this));
        } else {
            document.removeEventListener(
                'keydown',
                this.handleEscKey.bind(this),
            );
        }
    }

    /**
     * Determines whether the calendar should render above or below the inputElement.
     * Adds the appropriate class to the panel.
     * @return {void}
     */
    determineRenderPosition() {
        // Get the bounding rectangle of the inputElement
        const inputRect = this.inputElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate available space above and below the inputElement
        const spaceAbove = inputRect.top;
        const spaceBelow = viewportHeight - inputRect.bottom;

        // Clear any existing render classes
        this.panel.classList.remove(
            CLASS_NAMES.openAtTop,
            CLASS_NAMES.openAtBottom,
        );

        if (spaceAbove > spaceBelow) {
            this.panel.classList.add(CLASS_NAMES.openAtTop);
        } else {
            this.panel.classList.add(CLASS_NAMES.openAtBottom);
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
    setDateFromStorage(storedDate, storedISO, stateKey, inputElement) {
        if (storedDate && storedISO) {
            this.state[stateKey] = new Date(storedISO).getTime(); // Convert ISO string to timestamp
            inputElement.value = storedDate;
        }
    }

    loadFromSessionStorage() {
        const storedCheckin = getFromSessionStorage(this.startStorageKey);
        const storedCheckinISO = getFromSessionStorage(
            `${this.startStorageKey}-iso`,
        );
        const storedCheckout = getFromSessionStorage(this.endStorageKey);
        const storedCheckoutISO = getFromSessionStorage(
            `${this.endStorageKey}-iso`,
        );

        this.setDateFromStorage(
            storedCheckin,
            storedCheckinISO,
            'checkin',
            this.startInput,
        );
        this.setDateFromStorage(
            storedCheckout,
            storedCheckoutISO,
            'checkout',
            this.endInput,
        );

        // Display the date range in the input field
        if (this.state.checkin && this.state.checkout) {
            this.inputElement.value = this.formatDateRange(
                this.state.checkin,
                this.state.checkout,
            );
        } else if (this.state.checkin) {
            this.inputElement.value = `${formatDateToLocale(this.state.checkin, this.dateLocale, this.weekdayFormat, this.dayFormat, this.monthFormat)}`;
        }

        this.applyHighlights(); // Apply the saved highlights to the calendar
    }

    createElementWithClasses(tag, classNames = []) {
        const element = document.createElement(tag);
        classNames.forEach((className) => element.classList.add(className));
        return element;
    }

    createElementWithText(tag, text, classNames = []) {
        const element = this.createElementWithClasses(tag, classNames);
        element.textContent = text;
        return element;
    }

    createElementWithAttributes(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.keys(attributes).forEach((attr) =>
            element.setAttribute(attr, attributes[attr]),
        );
        return element;
    }

    bindClickOutside() {
        document.addEventListener('click', (event) => {
            if (
                this.calendarVisible &&
                !this.contains(event.target) &&
                !this.panel.contains(event.target)
            ) {
                this.toggleCalendar();
            }
        });
    }

    /**
     * Binds keyboard events to the calendar component.
     * - Prevents form submission on Enter key press and toggles the calendar visibility.
     * - Closes the calendar on Escape key press.
     * - Navigates through calendar days using arrow keys.
     */
    bindKeyboardEvents() {
        document.addEventListener('keydown', (event) => {
            const focusedElement = document.activeElement;

            // Check if the focus is within the component
            if (!this.contains(document.activeElement)) {
                return;
            }
            if (event.key === 'Enter') {
                // Prevent form submission on pressing enter key except for the day buttons
                if (
                    !focusedElement.classList.contains(
                        'irnmn-calendar__day-btn',
                    )
                ) {
                    event.preventDefault();
                }
                if (!this.calendarVisible) {
                    this.toggleCalendar();
                    // Focus on the day button with "is-checkin" class if it exists, otherwise focus on the first day button
                    const checkinButton = this.querySelector(
                        '.irnmn-calendar__day-btn.is-checkin',
                    );
                    const firstDayButton = this.querySelector(
                        '.irnmn-calendar__day-btn:not([disabled])',
                    );
                    if (checkinButton) {
                        checkinButton.focus();
                    } else if (firstDayButton) {
                        firstDayButton.focus();
                    }
                }
            }
            // close on pressing escape key
            if (this.calendarVisible && event.key === 'Escape') {
                this.toggleCalendar();
                this.inputElement.focus();
            }
            // Navigate through days using arrow keys
            if (focusedElement.classList.contains('irnmn-calendar__day-btn')) {
                let newFocusElement;
                switch (event.key) {
                    case 'ArrowUp':
                    case 'ArrowRight':
                        newFocusElement = this.getNextDayButton(
                            focusedElement,
                            'right',
                        );
                        break;
                    case 'ArrowDown':
                        newFocusElement = this.getNextDayButton(
                            focusedElement,
                            'down',
                        );
                        break;
                    case 'ArrowLeft':
                        newFocusElement = this.getNextDayButton(
                            focusedElement,
                            'left',
                        );
                        break;
                    case 'ArrowUp':
                        newFocusElement = this.getNextDayButton(
                            focusedElement,
                            'up',
                        );
                        break;
                }
                if (newFocusElement && !newFocusElement.disabled) {
                    newFocusElement.focus();
                }
            }
        });
    }

    /**
     * Retrieves the next day button based on the current button and direction.
     *
     * @param {HTMLElement} currentButton - The currently selected button element.
     * @param {string} direction - The direction to move to find the next button.
     *                             Possible values are 'right', 'down', 'left', 'up'.
     * @returns {HTMLElement|null} - The next button element in the specified direction, or null if none exists.
     */
    getNextDayButton(currentButton, direction) {
        const buttons = Array.from(
            this.querySelectorAll('.irnmn-calendar__day-btn:not([disabled])'),
        );
        const currentIndex = buttons.indexOf(currentButton);

        let newIndex;

        switch (direction) {
            case 'right':
                newIndex = currentIndex + 1;
                break;
            case 'down':
                newIndex = currentIndex + 7;
                break;
            case 'left':
                newIndex = currentIndex - 1;
                break;
            case 'up':
                newIndex = currentIndex - 7;
                break;
        }

        return buttons[newIndex] || null;
    }
}
customElements.define('irnmn-calendar', IRNMNCalendar);
