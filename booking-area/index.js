import { BOOKING_AREA_TYPE, CLASS_NAME_PREFIX } from './utils/constants.js';

class IRNMNBookingArea extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Initializes locations, renders the component, and attaches event listeners.
     */
    async connectedCallback() {
        /**
         * Setting up the initial booking settings structure
         * Object.preventExtension() prevents adding or removing new properties so we can make sure these keys exist
         * when we need to access them.
         *
         * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions
         */
        this.bookingAreaSettings = Object.preventExtensions({
            bookingArea: {
                type: BOOKING_AREA_TYPE.BAR,
                formId: "",
                classNames: [`${CLASS_NAME_PREFIX}__form`],
                formAction: ""
            },
            location: {
                classNames: [`${CLASS_NAME_PREFIX}__location`],
                label: "Location",
                placeholder: "Please Select",
                name: "hotelCode",
                errorMessage: "",
                default: "",
                locationsEndpoint: ""
            },
            calendar: {
                classNames: [`${CLASS_NAME_PREFIX}__calendar`],
                id: "",
                label: "Check in / Check out",
                placeholder: ' Check in / Check out',
                name: "checkInOutDates",
                formatDateValue: 'YYYY-MM-DD',
                openingDate: "",
                openDateMessage: "",
                errorMessage: "",
                inputName: 'date-selection',
                checkInDateName: "checkin",
                checkOutDateName: "checkout",
                weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                dateLocale: "en-gb"
            },
            guestSummary: {
                classNames: [`${CLASS_NAME_PREFIX}__guests-summary`],
                label: "Guests",
                guestLabels: {
                    adults: "Guests",
                    room: "Room",
                    rooms: "Rooms"
                },
                storageKey: "irnmn-rooms",
                sumGuests: true,
                enableChildren: true,
                ariaLabels: {
                    edit: "Open the booking panel to edit Rooms and Guests"
                },
                editLabel: "edit"

            },
            roomSelector: {
                classNames: [`${CLASS_NAME_PREFIX}__room-selector`],
                id: "",
                roomsNumber: 4,
                maxTotalGuests: 6,
                adultsNumber: 4,
                enableChildren: true,
                enableChildrenAges: true,
                childrenNumber: 3,
                maxChildAge: 17,
                roomLabels: {
                    room: "Room",
                    rooms: "Rooms",
                    guests: "Guests",
                    adults: "Adults",
                    children: "Children",
                    childAge: "Child age",
                    selectRoom: "Number of rooms",
                    remove: "remove",
                    ariaLabelMoreAdults: "Add more adults",
                    ariaLabelLessAdults: "Remove an adult",
                    ariaLabelMoreChildren: "Add more children",
                    ariaLabelLessChildren: "Remove a child"
                }
            },
            promoCode: {
                classNames: [`${CLASS_NAME_PREFIX}__promo-code`],
                label: "Code",
                placeholder: "I have a code",
                name: "rateCode",
                value: "",
                dataId: "promo-code",

            },
            bookingTracking: {
                startDateName: "checkin",
                endDateName: "checkout",
                promoCodeName: "rateCode",
                placement: "",
                needValidation: true
            },
            submit: {
                classNames: [`${CLASS_NAME_PREFIX}__submit`],
                label: "Check Availability"
            }
        });

        /**
         * Render the first time only when locations are loaded
         */
        this.render();
    }

    /**
     * Lifecycle method called when the component is removed from the DOM.
     * Cleans up event listeners to prevent memory leaks.
     */
    disconnectedCallback() {
        // Remove the custom sync event listener to avoid memory leaks
        document.removeEventListener(
            'locationSync',
            this.syncLocation.bind(this),
        );
    }

    /**
     * Gets the label for the location dropdown.
     *
     * @return {string} The label text or the default "Select Location".
     */
    get label() {
        return this.getAttribute('label') || 'Select Location';
    }

    get showPromoCode() {
        return true;
    }

    /**
     * Returns the stringified class names from an array
     *
     * @param {Array} classNames
     * @returns
     */
    classNamesToString(classNames) {
        if(Array.isArray(classNames)) return classNames.join(" ");

        return '';
    }

    render() {
        // Adding a base class for the irnmn-booking-area element based on the type
        const BOOKING_AREA_CLASS = this.bookingAreaSettings.bookingArea.type == BOOKING_AREA_TYPE.BAR
            ? `${CLASS_NAME_PREFIX}--booking-area__bar`
            : `${CLASS_NAME_PREFIX}--booking-area__panel`;
        this.classList.add(BOOKING_AREA_CLASS);

        this.innerHTML = `
            <form
                id="${this.bookingAreaSettings.bookingArea.formId}"
                class="${this.bookingAreaSettings.bookingArea.classNames.toString()}" autocomplete="off" target="_blank"
                action="${this.bookingAreaSettings.bookingArea.formAction}"
            >
                <irnmn-booking-tracking
                    form-id="${this.bookingAreaSettings.bookingArea.formId}"
                    start-date-name="${this.bookingAreaSettings.bookingTracking.startDateName}"
                    end-date-name="${this.bookingAreaSettings.bookingTracking.endDateName}"
                    promo-code-name="${this.bookingAreaSettings.bookingTracking.promoCodeName}"
                    placement="${this.bookingAreaSettings.bookingTracking.placement}"
                    need-validation="${this.bookingAreaSettings.bookingTracking.needValidation}"
                ></irnmn-booking-tracking>

                <irnmn-location
                    class="${CLASS_NAME_PREFIX}__input ${this.classNamesToString(this.bookingAreaSettings.location.classNames)}"
                    label="${this.bookingAreaSettings.location.label}"
                    placeholder="${this.bookingAreaSettings.location.placeholder}"
                    name="${this.bookingAreaSettings.location.name}"
                    error-message="${this.bookingAreaSettings.location.errorMessage}"
                    show-error="false"
                    default="${this.bookingAreaSettings.location.default}"
                    locations-endpoint="${this.bookingAreaSettings.location.locationsEndpoint}"
                ></irnmn-location>

                <irnmn-calendar
                    class="${CLASS_NAME_PREFIX}__input ${this.classNamesToString(this.bookingAreaSettings.calendar.classNames)}"
                    id="${this.bookingAreaSettings.calendar.id}"
                    label="${this.bookingAreaSettings.calendar.label}"
                    placeholder="${this.bookingAreaSettings.calendar.placeholder}"
                    name="${this.bookingAreaSettings.calendar.name}"
                    format-date-values="${this.bookingAreaSettings.calendar.formatDateValue}"
                    opening-date="${this.bookingAreaSettings.calendar.openingDate}"
                    open-date-message="${this.bookingAreaSettings.calendar.openDateMessage}"
                    error-message="${this.bookingAreaSettings.calendar.errorMessage}"
                    show-error="false"
                    input-name="${this.bookingAreaSettings.calendar.inputName}"
                    checkin-date-name="${this.bookingAreaSettings.calendar.checkInDateName}"
                    checkout-date-name="${this.bookingAreaSettings.calendar.checkOutDateName}"
                    weekDays="${this.bookingAreaSettings.calendar.weekDays}"
                    date-locale="${this.bookingAreaSettings.calendar.dateLocale}">
                </irnmn-calendar>


                ${ this.bookingAreaSettings.bookingArea.type == BOOKING_AREA_TYPE.BAR ?
                    `
                    <div class="${CLASS_NAME_PREFIX}__input ${this.classNamesToString(this.bookingAreaSettings.guestSummary.classNames)}">
                        <label>${this.bookingAreaSettings.guestSummary.label}</label>
                        <irnmn-guests-summary
                            storage-key="${this.bookingAreaSettings.guestSummary.storageKey}"
                            sum-guests="${this.bookingAreaSettings.guestSummary.sumGuests}"
                            enable-children="${this.bookingAreaSettings.guestSummary.enableChildren}"
                            labels='${JSON.stringify(this.bookingAreaSettings.guestSummary.guestLabels)}'
                        ></irnmn-guests-summary>
                        <a href="#" class="irnmn-guests-summary--edit-button wp-block-button--open-book-panel"
                            aria-label="${this.bookingAreaSettings.guestSummary.ariaLabels.edit}">
                            <span>${this.bookingAreaSettings.guestSummary.editLabel}</span>
                        </a>
                    </div>
                    ` : ''
                }

                ${ this.bookingAreaSettings.bookingArea.type == BOOKING_AREA_TYPE.PANEL ?
                    `
                    <irnmn-rooms-selector
                        class="${CLASS_NAME_PREFIX}__input ${this.classNamesToString(this.bookingAreaSettings.roomSelector.classNames)}"
                        rooms-number="${this.bookingAreaSettings.roomSelector.roomsNumber}"
                        labels='${this.bookingAreaSettings.roomSelector.roomLabels}'
                        max-total-guests="${this.bookingAreaSettings.roomSelector.maxTotalGuests}"
                        adults-number="${this.bookingAreaSettings.roomSelector.adultsNumber}"
                        enable-children="${this.bookingAreaSettings.roomSelector.enableChildren}"
                        enable-children-ages="${this.bookingAreaSettings.roomSelector.enableChildrenAges}">
                        children-number="${this.bookingAreaSettings.roomSelector.enableChildrenAges}"
                        max-child-age="${this.bookingAreaSettings.roomSelector.maxChildAge}"
                    </irnmn-rooms-selector>
                    ` : ''
                }

                ${ this.showPromoCode ?
                    `
                    <irnmn-text
                        class="${CLASS_NAME_PREFIX}__input ${this.classNamesToString(this.bookingAreaSettings.promoCode.classNames)}"
                        label="${this.bookingAreaSettings.promoCode.label}"
                        placeholder="${this.bookingAreaSettings.promoCode.placeholder}"
                        name="${this.bookingAreaSettings.promoCode.name}"
                        value="${this.bookingAreaSettings.promoCode.value}"
                        data-id="${this.bookingAreaSettings.promoCode.dataId}"
                    ></irnmn-text>
                    `
                    : ''
                }

                <button class="${this.classNamesToString(this.bookingAreaSettings.submit.classNames)}" type="submit">
                    ${this.bookingAreaSettings.submit.label}
                </button>

            </form>
        `;
    }
}

customElements.define('irnmn-booking-area', IRNMNBookingArea);
