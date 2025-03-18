import { createHiddenInput } from "../utils/components.js";
class IRNMNBookingAllCom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.form.addEventListener('submit', (event) =>
            this.handleAllComBookingEngine(event),
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

    get childAge() {
        return this.getAttribute('child-age') || '6';
    }

    /**
     * Handle form submission for the all.com booking engine only.
     *
     * This function will add additional hidden fields that will then be
     * passed to the all.com booking engine when the form is submitted.
     *
     */
    handleAllComBookingEngine() {
        let formData = new FormData(this.form);
        const hotelCode = formData.get('hotelCode');

        // Check if the hotel code is part of the list of supported hotels
        if (!this.hotelCodes.includes(hotelCode)) return;

        // Calculate length of stay
        const checkinDate = new Date(formData.get(this.startDateName));
        const checkoutDate = new Date(formData.get(this.endDateName));
        const nights = (checkoutDate - checkinDate) / (1000 * 60 * 60 * 24);

        // Create separate fields for day, month, year needed for the all.com booking engine
        const dayIn = checkinDate.getDate();
        const monthIn = checkinDate.getMonth() + 1; // Months are zero-based
        const yearIn = checkinDate.getFullYear();

        createHiddenInput(this.form, 'destination', hotelCode);
        createHiddenInput(this.form, 'dayIn', dayIn);
        createHiddenInput(this.form, 'monthIn', monthIn);
        createHiddenInput(this.form, 'yearIn', yearIn);
        createHiddenInput(this.form, 'nightNb', nights);

        // Default needed for the all.com booking engine
        createHiddenInput(this.form, 'goto', 'wl_intpartner_search');

        const locale = navigator.language || navigator.userLanguage;
        const languageCode = locale.substring(0, 2);
        createHiddenInput(this.form, 'code_langue', languageCode);

        // Promo code on all.com is very sensitive. If you enter a wrong code
        // it will not show any results.
        const promoCode = formData.get('promoCode') || formData.get('rateCode') || '';
        createHiddenInput(this.form, 'preferredCode', promoCode);

        // currently only one room is supported. This will need to be updated if multiple rooms are supported
        createHiddenInput(this.form, 'roomNumber', 1);

        const adults = formData.get('adults') || formData.get('rooms[0].adults'); // 1st if guest dropdown, 2nd if guests-selector component
        createHiddenInput(
            this.form,
            'room[0].adultNumber',
            adults,
        );

        const children = formData.get('children') || formData.get('rooms[0].children'); // 1st if guest dropdown, 2nd if guests-selector component
        createHiddenInput(
            this.form,
            'room[0].childrenNumber',
            children,
        );

        const childrenCount = formData.get('children') || formData.get('rooms[0].children'); // 1st if guest dropdown, 2nd if guests-selector component
        if (childrenCount) {
            for (let i = 0; i < childrenCount; i++) {
                const childAge = formData.get(`rooms[0].childrenAges[${i}]`) || this.childAge;
                createHiddenInput(this.form, `room[0].childrenAge[${i}]`, childAge);
            }
        }
    }
}

customElements.define('irnmn-booking-all-com', IRNMNBookingAllCom);
