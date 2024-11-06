/**
 * Get the next 12 months from the open date
 * @param {Date} openingDate The date to start from
 * @return {Array} An array of objects representing the next 12 months (year, month, days)
 */
/**
 * Get the next 12 months from the open date
 * @param {Date} openingDate The date to start from
 * @return {Array} An array of objects representing the next 12 months (year, month, days)
 */
export function getNext12Months(openingDate) {
    const months = [];
    const startYear = openingDate.getFullYear();
    const startMonth = openingDate.getMonth();

    for (let offset = 0; offset < 12; offset++) {
        const currentMonth = (startMonth + offset) % 12;
        const yearOffset = Math.floor((startMonth + offset) / 12);
        const currentYear = startYear + yearOffset;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // Adjust Sunday to 6, Monday to 0

        const days = [];

        // Add placeholder days (disabled buttons) for alignment
        for (let i = 0; i < firstWeekday; i++) {
            days.push({
                date: null, // No actual date for placeholders
                day: null, // No day number for placeholders
                disabled: true, // Mark as disabled
            });
        }

        // Add actual days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(currentYear, currentMonth, day),
                day,
                disabled: false, // These are valid days
            });
        }

        months.push({
            year: currentYear,
            month: currentMonth,
            days,
        });
    }

    return months;
}

/**
 * Format a date as a string in the requested format
 * (change it later based on the component attribute)
 * @param {Date} date The date to format
 * @param {String} dateLocale The locale to format the date
 * @return {String} The formated date
 */
export function formatDateToLocale(date, dateLocale = 'en-gb') {
    return new Intl.DateTimeFormat(dateLocale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

/**
 * Format a date as a string in the requested format
 * @param {Date} date The date to format
 * @param {String} format The format to use (e.g., 'YYYY-MM-DD')
 * @return {String} The formatted date
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    const pad = (number) => (number < 10 ? '0' + number : number);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}
