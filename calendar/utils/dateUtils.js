/**
 * Get the next 12 months from the open date
 * @param {Date} openDate The date to start from
 * @return {Array} An array of objects representing the next 12 months (year, month, days)
 */
export function getNext12Months(openDate) {
    const months = [];
    const startYear = openDate.getUTCFullYear();
    const startMonth = openDate.getUTCMonth();

    for (let offset = 0; offset < 12; offset++) {
        const currentMonth = (startMonth + offset) % 12;
        const yearOffset = Math.floor((startMonth + offset) / 12);
        const currentYear = startYear + yearOffset;

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const days = [];

        for (let day = 1; day <= daysInMonth; day++) {
            days.push({
                date: new Date(currentYear, currentMonth, day),
                day
            });
        }

        months.push({
            year: currentYear,
            month: currentMonth,
            days
        });
    }
    return months;
}

/**
 * Format a date as a string in the format "dd/mm/yyyy"
 * (change it later based on the component attribute)
 * @param {Date} date The date to format
 * @return {String} The formated date
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}
