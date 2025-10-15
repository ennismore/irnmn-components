import { createHiddenInput } from '../utils/components.js';

class IRNMNBookingVerb extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);
        if (!this.form) return;

        this.boundHandleBooking = this.handleVerbBookingEngine.bind(this);
        this.form.addEventListener('submit', this.boundHandleBooking);
    }

    disconnectedCallback() {
        if (this.form) {
            this.form.removeEventListener('submit', this.boundHandleBooking);
        }
    }

    // === Attribute getters ===
    get formId() {
        return this.getAttribute('form-id') || null;
    }

    get startDateName() {
        return this.getAttribute('start-date-name') || 'checkin';
    }

    get endDateName() {
        return this.getAttribute('end-date-name') || 'checkout';
    }

    get hotelCodes() {
        const codes = this.getAttribute('hotel-codes');
        return codes ? JSON.parse(codes) : [];
    }

    get clientId() {
        return this.getAttribute('client-id') || 'sbe';
    }

    get primaryLangId() {
        // Priority: explicit attribute → Weglot → <html lang="">
        if (this.getAttribute('primary-lang-id')) {
            return this.getAttribute('primary-lang-id');
        }

        // Detect Weglot if available
        if (typeof Weglot !== 'undefined' && Weglot.getCurrentLang) {
            return Weglot.getCurrentLang();
        }

        // Fallback to HTML lang or default to 'en'
        return document.documentElement.lang || 'en';
    }

    /**
     * Handle form submission for the Verb booking engine only.
     *
     * This function will add additional hidden fields that will then be
     * passed to the book.ennismore.com/book/ Verb booking engine when the form is submitted.
     *
     */
    handleVerbBookingEngine(event) {
        let formData = new FormData(this.form);
        const hotelCode = formData.get('hotelCode');

        // Check if the hotel code is part of the list of supported hotels
        if (!this.hotelCodes.includes(hotelCode)) return;

        // Prevent default so we can adjust parameters
        event.preventDefault();

        // Change date format
        const checkin = formData.get(this.startDateName);
        const checkout = formData.get(this.endDateName);
        const roomsTotal = formData.get('rooms-total') || 1;
        const promoCode = formData.get('rateCode') || '';

        // Sum total adults and children across all rooms
        const totalAdults = [...formData.keys()]
            .filter((key) => key.includes('.adults'))
            .reduce(
                (sum, key) => sum + parseInt(formData.get(key) || 0, 10),
                0,
            );

        const totalChildren = [...formData.keys()]
            .filter((key) => key.includes('.children') && !key.includes('Ages'))
            .reduce(
                (sum, key) => sum + parseInt(formData.get(key) || 0, 10),
                0,
            );

        // === Format dates ===
        const formattedCheckin = this.formatDateISO(checkin);
        const formattedCheckout = this.formatDateISO(checkout);

        // === Add hidden inputs ===
        createHiddenInput(this.form, 'hotelCode', hotelCode);
        createHiddenInput(this.form, 'startDate', formattedCheckin);
        createHiddenInput(this.form, 'endDate', formattedCheckout);
        createHiddenInput(this.form, 'numRooms', roomsTotal);
        createHiddenInput(this.form, 'adults', totalAdults);
        createHiddenInput(this.form, 'children', totalChildren);
        createHiddenInput(this.form, 'clientId', this.clientId);
        if (promoCode) createHiddenInput(this.form, 'promoCode', promoCode);

        // === Submit or redirect ===
        const params = new URLSearchParams({
            hotelCode,
            startDate: formattedCheckin,
            endDate: formattedCheckout,
            numRooms: roomsTotal,
            adults: totalAdults,
            children: totalChildren,
            clientId: this.clientId,
            primaryLangId: this.primaryLangId,
        });

        if (promoCode) params.append('promoCode', promoCode);

        const targetUrl = `https://book.ennismore.com/book/?${params.toString()}`;

        // Redirect instead of form submission (Verb expects GET)
        window.location.href = targetUrl;
    }

    /**
     * Converts YYYY-MM-DD or DD/MM/YYYY to YYYY-MM-DD
     */
    formatDateISO(date) {
        if (!date) return '';
        if (date.includes('/')) {
            const [day, month, year] = date.split('/');
            return `${year}-${month}-${day}`;
        }
        return date; // assume already ISO
    }
}
if (!customElements.get('irnmn-booking-verb')) {
    customElements.define('irnmn-booking-verb', IRNMNBookingVerb);
}
