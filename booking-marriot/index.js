import { createHiddenInput, handleExternalUrl } from '../utils/components.js';

class IRNMNBookingMarriot extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.form.addEventListener('submit', (event) =>
            this.handleMarriotBookingEngine(event),
        );
    }

    disconnectedCallback() {
        if (!this.form) return;
        this.form.removeEventListener('submit', this.handleAllComBookingEngine);
    }

    get formId() {
        return this.getAttribute('form-id') || null;
    }

    get startDateName() {
        return this.getAttribute('start-date-name') || 'startDate';
    }

    get endDateName() {
        return this.getAttribute('end-date-name') || 'endDate';
    }

    get hotelCodes() {
        const codes = this.getAttribute('hotel-codes');
        return codes ? JSON.parse(codes) : [];
    }

    /**
     * Handle form submission for the Marriot booking engine only.
     *
     * This function will add additional hidden fields that will then be
     * passed to the www.marriott.com/reservation/ booking engine when the form is submitted.
     *
     */
    handleMarriotBookingEngine(event) {
        let formData = new FormData(this.form);
        const hotelCode = formData.get('hotelCode');

        // Check if the hotel code is part of the list of supported hotels
        if (!this.hotelCodes.includes(hotelCode)) return;

        // Change date format
        const checkinDate = formData.get(this.startDateName);
        const checkoutDate = formData.get(this.endDateName);
        const checkinDateFormated = this.formatDate(checkinDate);
        const checkoutDateFormated = this.formatDate(checkoutDate);

        // Parse form action URL and create hidden fields based on the URL's search parameters
        // example of external url : https://www.marriott.com/reservation/availability.mi?propertyCode={hotelCode}&fromDate={checkin}&toDate={checkout}
        handleExternalUrl(this.form);

        // Create additional hidden fields or update existing ones
        createHiddenInput(this.form, 'fromDate', checkinDateFormated);
        createHiddenInput(this.form, 'toDate', checkoutDateFormated);
    }

    formatDate(date) {
        const dateArray = date.split('-');
        return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`;
    }
}

customElements.define('irnmn-booking-marriot', IRNMNBookingMarriot);
