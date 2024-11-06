import { CLASS_NAMES } from './constants.js';

/**
 * Creates a month element with the provided month data (button days and weekdays header)
 * @param {Object} month The month data object
 * @param {Array} weekDays The list of week days to display (optional)
 * @param {String} dateLocale The locale to format the date
 * @return {HTMLElement} The month element
 */

export function createMonthElement(month, weekDays, dateLocale = 'en-gb') {
    const monthEl = document.createElement('div');
    monthEl.classList.add(CLASS_NAMES.month);
    monthEl.setAttribute('role', 'region');
    monthEl.setAttribute('aria-labelledby', `month-${month.year}-${month.month}`);

    const monthTitle = document.createElement('p');
    monthTitle.classList.add(CLASS_NAMES.monthTitle);
    monthTitle.id = `month-${month.year}-${month.month}`;
    monthTitle.textContent = new Intl.DateTimeFormat(dateLocale, { month: 'long', year: 'numeric' }).format(
        new Date(month.year, month.month)
    );
    monthTitle.setAttribute('aria-label', `Month of ${monthTitle.textContent}`);

    // Create the main container for the days of the month
    const daysWrapper = document.createElement('div');
    daysWrapper.className = CLASS_NAMES.daysWrapper;

    const daysContainer = document.createElement('div');
    daysContainer.className = CLASS_NAMES.daysContainer;
    daysContainer.setAttribute('role', 'grid');

    // Optional: Create the weekdays header row
    if (weekDays) {
        const weekdayHeader = createWeekdayHeader(weekDays);
        daysWrapper.appendChild(weekdayHeader);
    }

    // Render the days (placeholders + actual days)
    month.days.forEach((day) => {
        if (day.disabled) {
            // Create placeholder for disabled days
            const disabledButton = document.createElement('button');
            disabledButton.type = 'button';
            disabledButton.disabled = true;
            disabledButton.classList.add(CLASS_NAMES.emptyDay);
            daysContainer.appendChild(disabledButton);
        } else {
            // Create actual day buttons
            const dayBtn = createDayButton(day, dateLocale);
            daysContainer.appendChild(dayBtn);
        }
    });

    daysWrapper.appendChild(daysContainer);
    monthEl.appendChild(monthTitle);
    monthEl.appendChild(daysWrapper);

    return monthEl;
}



/**
 * Creates a button element for the provided day
 * @param {Object} day The day object
 * @param {String} dateLocale The locale to format the date
 * @return {HTMLElement} The button element
 */
export function createDayButton(day, dateLocale = 'en-gb') {

    // Handle actual days
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.textContent = day.day;
    dayBtn.dataset.time = day.date.getTime();
    dayBtn.classList.add(CLASS_NAMES.dayBtn);
    dayBtn.setAttribute('role', 'gridcell');

    dayBtn.setAttribute(
        'aria-label',
        `Select date ${new Intl.DateTimeFormat(dateLocale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(day.date)}`
    );

    return dayBtn;
}


/**
 * Creates the weekday header - row element
 * @param {Array} weekDays The list of week days to display
 * @return {HTMLElement} The weekday header row element
 */
function createWeekdayHeader(weekDays) {
    const headerRow = document.createElement('div');
    headerRow.classList.add(CLASS_NAMES.weekDayHeader);
    headerRow.setAttribute('role', 'row'); // Accessibility role for a row

    weekDays.forEach((day) => {
        const dayEl = document.createElement('span');
        dayEl.classList.add(CLASS_NAMES.weekDay);
        dayEl.setAttribute('role', 'columnheader'); // Accessibility role for a table column header
        dayEl.textContent = day;
        headerRow.appendChild(dayEl);
    });

    return headerRow;
}


/**
 * Adds empty day placeholders to the container to align the first day of the month
 * @param {HTMLElement} container - The container to append empty placeholders to
 * @param {Number} count - The number of empty placeholders to add
 * @param {String} className - The CSS class to apply to the empty placeholders
 * @return {void}
 */
export function addEmptyDays(container, count, className) {
    for (let i = 0; i < count; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add(className); // Apply the provided class for empty days
        container.appendChild(emptyDay);
    }
}
