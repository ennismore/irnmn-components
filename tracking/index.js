class IRNMNBookingTracking extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;

        this.form.addEventListener('submit', (event) =>
            this.handleTracking(event),
        );
    }

    disconnectedCallback() {
        if (!this.form) return;
        this.form.removeEventListener('submit', this.handleTracking);
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

    get promoCodeName() {
        return this.getAttribute('promo-code-name') || 'rateCode';
    }

    get placement() {
        return this.getAttribute('placement') || 'booking bar';
    }

    get needValidation() {
        return this.getAttribute('need-validation') || false;
    }

    get debug() {
        return this.getAttribute('debug') || false;
    }


    /**
     * Handle form submission for the All Inclusive booking engine only.
     *
     * This function will add additional hidden fields that will then be
     * passed to the https://allinclusive-collection.com/ booking engine when the form is submitted.
     *
     */
    handleTracking() {

        // Early return if the form is not valid and validation is required
        if (this.needValidation && !this.form.hasAttribute('valid')) {
            return;
        }

        const formData = new FormData(this.form);
        const roomsTotal = formData.get('rooms-total') || formData.get('rooms') || 1;
        const activeLocation = this.form.querySelector('irnmn-location').getActiveLocation() || null;

        let adult_total = 0;
        let children_total = 0;

        // Calculate total number of adults and children
        for (let i = 0; i < roomsTotal; i++) {
            adult_total += parseInt(formData.get(`rooms[${i}].adults`)) || 0;
            children_total += parseInt(formData.get(`rooms[${i}].children`)) || 0;
        }

        // build the tracking event
        const tracking_event = {
            event: 'room_check_availability',
            destination: activeLocation?.hotelName?.toLowerCase() || '',
            checkin_date: formData.get(this.startDateName),
            checkout_date: formData.get(this.endDateName),
            rooms: roomsTotal,
            adult: adult_total,
            child: children_total,
            placement: this.placement,
            code: formData.get(this.promoCodeName)?.toLowerCase() || '',
        };
        if (this.debug) {
            console.log('Tracking Event:', tracking_event);
        }
        // Push the event to the dataLayer
        window.dataLayer?.push(tracking_event);

    }
}

customElements.define('irnmn-booking-tracking', IRNMNBookingTracking);
