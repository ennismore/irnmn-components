import { CLASS_NAMES } from './constants.js';

export function createMonthElement(month) {
    const monthEl = document.createElement('div');
    monthEl.classList.add(CLASS_NAMES.month);

    const monthTitle = document.createElement('p');
    monthTitle.classList.add(CLASS_NAMES.monthTitle);
    monthTitle.textContent = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(
        new Date(month.year, month.month)
    );

    const daysContainer = document.createElement('div');
    daysContainer.className = CLASS_NAMES.daysContainer;

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
    return dayBtn;
}

export function toggleElementDisplay(element, isVisible) {
    element.style.display = isVisible ? 'block' : 'none';
}
