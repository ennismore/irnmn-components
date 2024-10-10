import { CLASS_NAMES } from './constants.js';

export function createMonthElement(month, weekDays, dateLocale = 'en-gb') {
    const monthEl = document.createElement('div');
    monthEl.classList.add(CLASS_NAMES.month);
    monthEl.setAttribute('role', 'region'); // Define it as a region for better accessibility
    monthEl.setAttribute('aria-labelledby', `month-${month.year}-${month.month}`); // Link to the month title for screen readers

    const monthTitle = document.createElement('p');
    monthTitle.classList.add(CLASS_NAMES.monthTitle);
    monthTitle.id = `month-${month.year}-${month.month}`;
    monthTitle.textContent = new Intl.DateTimeFormat(dateLocale, { month: 'long', year: 'numeric' }).format(
        new Date(month.year, month.month)
    );
    monthTitle.setAttribute('aria-label', `Month of ${monthTitle.textContent}`); // Label for screen readers

    // Create the main container for the days of the month
    const daysWrapper = document.createElement('div');
    daysWrapper.className = CLASS_NAMES.daysWrapper; // New class for the day wrapper

    const daysContainer = document.createElement('div');
    daysContainer.className = CLASS_NAMES.daysContainer;
    daysContainer.setAttribute('role', 'grid'); // Indicate that it contains a grid of days

    if (weekDays) {
        // Create the weekdays header row if the weekDays parameter is provided
        const weekdayHeader = createWeekdayHeader(weekDays);
        daysWrapper.appendChild(weekdayHeader);
    }

    daysWrapper.appendChild(daysContainer);
    monthEl.appendChild(monthTitle);
    monthEl.appendChild(daysWrapper);

    return monthEl;
}


export function createDayButton(day, dateLocale = 'en-gb') {
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.textContent = day.day;
    dayBtn.dataset.time = day.date.getTime();
    dayBtn.classList.add(CLASS_NAMES.dayBtn);
    dayBtn.setAttribute('role', 'gridcell');

    dayBtn.setAttribute('aria-label', `Select date ${new Intl.DateTimeFormat(dateLocale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(day.date)}`);

    return dayBtn;
}

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

export function toggleElementDisplay(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
    element.setAttribute('aria-hidden', !isVisible); 
}
