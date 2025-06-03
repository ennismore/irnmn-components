/**
 * <irnmn-price-syncing> custom element for syncing room prices.
 */
class IrnmnPriceSyncing extends HTMLElement {
    /** @type {NodeListOf<HTMLElement>} */
    #roomPricings = null;

    constructor() {
        super();
    }

    /** @returns {string} */
    get hotelRefId() {
        return this.getAttribute('hotel-ref-id') || '';
    }

    /** @returns {string} */
    get apiEndpoint() {
        return this.getAttribute('api-endpoint') || '';
    }

    /** @returns {string} */
    get checkinDateName() {
        return this.getAttribute('checkin-date-name') || '';
    }

    /** @returns {string} */
    get checkoutDateName() {
        return this.getAttribute('checkout-date-name') || '';
    }

    /** @returns {string} */
    get dateName() {
        return this.getAttribute('date-name') || 'date-selection';
    }

    /** @returns {string} */
    get locale() {
        return this.getAttribute('locale') || '';
    }

    /**
     * Called when the element is inserted into the DOM.
     */
    async connectedCallback() {
        this.#roomPricings = this.parentElement?.querySelectorAll('irnmn-room-pricing') || [];
        if (!this.#roomPricings.length) {
            console.error('No room pricings found in parent element');
            return;
        }
        await this.syncPrices();
        this.addListeners();
    }

    /**
     * Adds event listeners for date changes.
     */
    addListeners() {
        document.addEventListener(`checkout-selected-${this.dateName}`, async (event) => {
            console.log('Checkout date changed:', event.detail);
            this.#roomPricings.forEach(roomPricingElement => {
                roomPricingElement.setAttribute('loading', 'true');
            });
            await this.syncPrices();
        });
    }

    /**
     * Fetches and syncs prices for all room pricing elements.
     */
    async syncPrices() {
        const rates = await this.fetchAvailabilities();
        if (!rates?.length) {
            console.error('No rates available to sync');
            return;
        }
        this.#roomPricings.forEach(roomPricingElement => {
            this.syncRoomPrice(roomPricingElement, rates);
        });
        console.log('Price syncing completed');
    }

    /**
     * Syncs price for a single room pricing element.
     * @param {HTMLElement} roomPricingElement
     * @param {Array} rates
     */
    syncRoomPrice(roomPricingElement, rates) {
        const roomCode = roomPricingElement.getAttribute('room-code');
        const roomObj = this.findRoomByCode(rates, roomCode);
        if (roomObj?.rates?.length) {
            const lowestRate = this.findLowestRate(roomObj.rates);
            const formattedPrice = this.formatPrice(lowestRate?.averageNightlyAmountAfterTax);
            roomPricingElement.setAttribute('price', formattedPrice.toString());
            console.log(`Price for room ${roomCode} set to: ${formattedPrice}`);
        } else {
            roomPricingElement.setAttribute('price', '0');
            console.warn(`No rates found for room code: ${roomCode}`);
        }
        roomPricingElement.setAttribute('loading', 'false');
    }

    /**
     * Finds a room by its code.
     * @param {Array} rates
     * @param {string} roomCode
     * @returns {object|null}
     */
    findRoomByCode(rates, roomCode) {
        return rates.find(r => r.room?.code === roomCode) || null;
    }

    /**
     * Finds the lowest rate in an array of rates.
     * @param {Array} rates
     * @returns {object|null}
     */
    findLowestRate(rates) {
        return rates.reduce((min, rate) => {
            const minValue = min?.averageNightlyAmountAfterTax?.value || Infinity;
            const rateValue = rate?.averageNightlyAmountAfterTax?.value || Infinity;
            return rateValue < minValue ? rate : min;
        }, null);
    }

    /**
     * Formats a price object to a string.
     * @param {object} rate
     * @returns {string}
     */
    formatPrice(rate) {
        if (!rate || typeof rate.value !== 'number' || typeof rate.decimal !== 'number' || !rate.currencyCode) {
            return '';
        }
        const amount = (rate.value / Math.pow(10, rate.decimal)).toLocaleString(undefined, { minimumFractionDigits: rate.decimal });
        const currencyFormats = {
            EUR: { symbol: '€', before: false },
            USD: { symbol: '$', before: true },
            GBP: { symbol: '£', before: true },
            SEK: { symbol: 'kr', before: false },
            NOK: { symbol: 'kr', before: false },
            DKK: { symbol: 'kr', before: false },
            JPY: { symbol: '¥', before: true }
        };
        const format = currencyFormats[rate.currencyCode] || { symbol: rate.currencyCode, before: true };
        return format.before ? `${format.symbol}${amount}` : `${amount} ${format.symbol}`;
    }

    /**
     * Fetches room availabilities from the API.
     * @returns {Promise<Array>}
     */
    async fetchAvailabilities() {
        if (!this.apiEndpoint || !this.hotelRefId) {
            console.error('API endpoint or hotelRefId is not provided');
            return [];
        }
        const checkinDateKey = `irnmn-${this.checkinDateName}-${this.dateName}`;
        const checkoutDateKey = `irnmn-${this.checkoutDateName}-${this.dateName}`;
        const checkinDate = window.sessionStorage.getItem(checkinDateKey) || '';
        const checkoutDate = window.sessionStorage.getItem(checkoutDateKey) || '';

        if (!checkinDate || !checkoutDate) {
            console.error('Check-in or check-out date is missing in sessionStorage:', { checkinDateKey, checkoutDateKey });
            return [];
        }

        const payload = {
            hotelReferenceId: this.hotelRefId,
            checkInDate: checkinDate,
            checkOutDate: checkoutDate,
            numberOfRooms: 1,
            guests: {
                adults: 1,
                children: 0,
                childrenAges: [],
                accessible: false
            },
            locale: {
                language: this.locale || 'en'
            },
            availabilityOptions: {
                withCostBreakdown: true
            }
        };

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'opYAfmo0DAyog7t6rPLX' // TODO : Find a better way to handle API keys
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data?.rooms || [];
        } catch (error) {
            console.error('Error fetching prices', error);
            return [];
        }
    }
}

customElements.define('irnmn-price-syncing', IrnmnPriceSyncing);
