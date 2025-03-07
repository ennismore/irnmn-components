import { createHiddenInput, handleExternalUrl } from '../utils/components.js';

class IRNMNBookingAIC extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.form.addEventListener('submit', (event) =>
            this.handleAICBookingEngine(event),
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
     * Handle form submission for the All Inclusive booking engine only.
     *
     * This function will add additional hidden fields that will then be
     * passed to the https://allinclusive-collection.com/ booking engine when the form is submitted.
     *
     */
    handleAICBookingEngine() {

        let formData = new FormData(this.form);
        const hotelCode = formData.get('hotelCode');

        // Check if the hotel code is part of the list of supported hotels
        if (!this.hotelCodes.includes(hotelCode)) return;

        // Calculate length of stay
        const checkinDate = new Date(formData.get(this.startDateName));
        const checkoutDate = new Date(formData.get(this.endDateName));
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

        // Construct remainingGuests
        // The AIC logic explained: This part of the AIC url &remainingGuests=4-3-5,2-11-11 means:
        // Each comma is a separate room. 1st room: 4 adults, one child 3 years old, second child 5 years old.
        // 2nd room: 2 adults and two 11years' old kids
        let remainingGuests = [];
        let roomCount = formData.get("rooms-total");

        for (let i = 0; i < roomCount; i++) {
            const adults =
                parseInt(formData.get(`rooms[${i}].adults`), 10) || 0;
            const children =
                parseInt(formData.get(`rooms[${i}].children`), 10) || 0;
            const childAges = [];

            for (let j = 0; j < children; j++) {
                const age = formData.get(`rooms[${i}].childrenAges[${j}]`);
                if (age) childAges.push(age);
            }

            // Combine adults and child ages in the required format
            remainingGuests.push([adults, ...childAges].join("-"));
        }

        // Parse form action URL and create hidden fields based on the URL's search parameters
        // example of external url : https://allinclusive-collection.com/en/booking/C383/room/?dateIn={checkin}&nights={null}&ridcode={hotelCode}&roomCount={rooms-total}&remainingGuests={null}
        handleExternalUrl(this.form);

        // Create additional hidden fields or update existing ones
        createHiddenInput(this.form, 'remainingGuests', remainingGuests);
        createHiddenInput(this.form, 'nights', nights);

        // Change form action URL if we're on language other than EN, that AIC support ( list from AIC documentation )
        const currentLang = this.getCurrentLanguage();
        if (!currentLang) return;
        const baseUrl = 'https://allinclusive-collection.com';
        const supportedLangs = {
            fr: `${baseUrl}/fr/reservation/${hotelCode}/chambre/`,
            de: `${baseUrl}/de/buchung/${hotelCode}/schlafzimmer/`,
            tr: `${baseUrl}/tr/rezervasyon/${hotelCode}/yatak-odasi/`,
            ru: `${baseUrl}/ru/Бронирование/${hotelCode}/cпальня/`,
            en: `${baseUrl}/en/booking/${hotelCode}/room/`,
        };

        if (supportedLangs[currentLang]) {
            this.form.action = supportedLangs[currentLang];
        }
    }

    /**
     * Retrieves the current language from the document's HTML `lang` attribute.
     *
     * @returns {string|null} The current language code (e.g., 'en' for English), or `null` if the `lang` attribute is not set.
     */
    getCurrentLanguage() {
        const langAttr = document.documentElement.lang;
        if (!langAttr) return null;
        return langAttr.split("-")[0]; //Split at the dash and return the first part
    }
}

customElements.define('irnmn-booking-aic', IRNMNBookingAIC);
