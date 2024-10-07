import { CLASS_NAMES } from './constants.js';

export function createMonthElement(month) {
    const monthEl = document.createElement('div');
    monthEl.classList.add(CLASS_NAMES.month);
    monthEl.setAttribute('role', 'region');
    monthEl.setAttribute('aria-labelledby', `month-${month.year}-${month.month}`); 

    const monthTitle = document.createElement('p');
    monthTitle.classList.add(CLASS_NAMES.monthTitle);
    monthTitle.id = `month-${month.year}-${month.month}`;
    monthTitle.textContent = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
        new Date(month.year, month.month)
    );
    monthTitle.setAttribute('aria-label', `Month of ${monthTitle.textContent}`);

    const daysContainer = document.createElement('div');
    daysContainer.className = CLASS_NAMES.daysContainer;
    daysContainer.setAttribute('role', 'grid');

    monthEl.appendChild(monthTitle);
    monthEl.appendChild(daysContainer);

    return monthEl;
}

export function createDayButton(day) {
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.textContent = day.day;
    dayBtn.dataset.time = day.date.getTime();
    dayBtn.classList.add(CLASS_NAMES.dayBtn);
    dayBtn.setAttribute('role', 'gridcell');

    dayBtn.setAttribute('aria-label', `Select date ${new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(day.date)}`);

    return dayBtn;
}

export function toggleElementDisplay(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
    element.setAttribute('aria-hidden', !isVisible); 
}
