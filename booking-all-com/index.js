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
     * Returns the number of adults selected in the form
     *
     * @param {FormData} formData
     * @param {int} index
     * @returns
     */
    getAdults(formData, index) {
        // 1st if guest dropdown, 2nd if guests-selector component
        return formData.get('adults') || formData.get(`rooms[${index}].adults`);
    }

    /**
     * Returns the number of children selected in the form
     *
     * @param {FormData} formData
     * @param {int} index
     * @returns
     */
    getChildren(formData, index) {
        // 1st if guest dropdown, 2nd if guests-selector component
        return formData.get('children') || formData.get(`rooms[${index}].children`);
    }


     /**
     * Removes Hidden Input Element if it exists
     *
     * @param {HTMLElement} container
     * @param {string} name
     */
     removeHiddenInput(container, name) {
        let input = container.querySelector(`input[name="${name}"]`);
        if(input) {
            input.remove();
        }
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


        // Retrieving the total number of rooms selected
        const roomsTotal = formData.get('rooms-total');
        createHiddenInput(this.form, 'roomNumber', roomsTotal);

        // For each room we create hidden inputs that represent the current state of booking selections regarding guests
        for(let i = 0; i < roomsTotal; i++) {

            // Creating hidden input for number of adults
            const adults = this.getAdults(formData, i);
            createHiddenInput(
                this.form,
                `room[${i}].adultNumber`,
                adults,
            );

            // Creating hidden inputs for number of children
            const children = this.getChildren(formData, i); // 1st if guest dropdown, 2nd if guests-selector component
            createHiddenInput(
                this.form,
                `room[${i}].childrenNumber`,
                children,
            );

            // Creating hidden inputs for children ages
           // const childrenCount = formData.get('children') || formData.get(`rooms[${i}].children`); // 1st if guest dropdown, 2nd if guests-selector component
            if (children) {
                for (let j = 0; j < children; j++) {
                    const childAge = formData.get(`rooms[${i}].childrenAges[${j}]`) || this.childAge;
                    createHiddenInput(this.form, `room[${i}].childrenAge[${j}]`, childAge);
                }
            }
        }

        // Removing unused hidden inputs
        // Running up to 32, just to make sure it removes all other possible rooms. There's probably a better way to do this
        for(let i = roomsTotal; i < 32; i++) {
            this.removeHiddenInput(this.form, `room[${i}].adultNumber`);

            for (let j = 0; j < 32; j++) {
                this.removeHiddenInput(this.form, `room[${i}].childrenAge[${j}]`);
            }
            this.removeHiddenInput(this.form, `room[${i}].childrenNumber`);
        }
    }
}

customElements.define('irnmn-booking-all-com', IRNMNBookingAllCom);
