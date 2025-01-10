class IRNMNBookingAllCom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.form.addEventListener('submit', (event) => this.handleAllComBookingEngine(event));
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
        const hotelCode = formData.get("hotelCode");

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

        this.createInput(this.form, "destination", hotelCode);
        this.createInput(this.form, "dayIn", dayIn);
        this.createInput(this.form, "monthIn", monthIn);
        this.createInput(this.form, "yearIn", yearIn);
        this.createInput(this.form, "nightNb", nights);

        // Default needed for the all.com booking engine
        this.createInput(this.form, "goto", "wl_intpartner_search");

        const locale = navigator.language || navigator.userLanguage;
        const languageCode = locale.substring(0, 2);
        this.createInput(this.form, "code_langue", languageCode);

        // currently only one room is supported. This will need to be updated if multiple rooms are supported
        this.createInput(this.form, "roomNumber", 1);
        this.createInput(this.form, "room[0].adultNumber", formData.get("adults"));
        this.createInput(this.form, "room[0].childrenNumber", formData.get("children"));

        // Currently only one room is supported. This will need to be updated if multiple rooms are supported
        if (formData.get('children')) {
            for (let i = 0; i < formData.get('children'); i++) {
                this.createInput(this.form, `room[0].childrenAge[${i}]`, this.childAge);
            }
        }

        // Promo code on all.com is very sensitive. If you enter a wrong code
        // it will not show any results.
        let promoCode = formData.get("promoCode");
        if (!promoCode) {
            promoCode = thisData.get("rateCode");
        }
        this.createInput(this.form, "preferredCode", promoCode ?? '');
    }

    /**
     * Create hidden input field and append it to the form. Used to pass data to
     * the all.com booking engine when the form is submitted.
     *
     * @param {HTMLElement} form
     * @param {string} name
     * @param {string} value
     *
     * @returns {void}
     */
    createInput(form, name, value) {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }
}

customElements.define('irnmn-booking-all-com', IRNMNBookingAllCom);
