class IrnmnPriceSyncing extends HTMLElement {
    constructor() {
        super();
        this.roomPricings = this.parentElement.querySelectorAll('irnmn-room-pricing');
        console.log('Room pricings found in parent element:', this.roomPricings);

    }

    get hotelRefId() {
        return this.getAttribute('hotel-ref-id') || '';
    }

    get APIendpoint() {
        return this.getAttribute('api-endpoint') || '';
    }

    get checkinDateName() {
        return this.getAttribute('checkin-date-name') || '';
    }

    get checkoutDateName() {
        return this.getAttribute('checkout-date-name') || '';
    }

    get dateName() {
        return this.getAttribute('date-name') || 'date-selection';
    }

    get locale() {
        return this.getAttribute('locale') || '';
    }

    async connectedCallback() {
        if (!this.roomPricings || this.roomPricings.length === 0) {
            console.error('No room pricings found in parent element');
            return;
        }
        await this.syncPrices();
        this.addListeners();
    }

    addListeners() {
        document.addEventListener(`checkout-selected-${this.dateName}`, async (event) => {
            console.log('Checkout date changed:', event.detail);
            this.roomPricings.forEach((roomPricingElement) => {
                roomPricingElement.setAttribute('loading', 'true');
            });
            await this.syncPrices();
        });
    }


    async syncPrices() {
        const rates = await this.fetchAvaibilities();
        console.log('Rates fetched:', rates);
        if (!rates) {
            console.error('No rates available to sync');
            return;
        }
        this.roomPricings.forEach((roomPricingElement) => {
            this.syncRoomPrice(roomPricingElement, rates);
        });
        console.log('Price syncing completed');
    }

    syncRoomPrice(roomPricingElement, rates) {
        const roomCode = roomPricingElement.getAttribute('room-code');
        const roomObj = this.findRoomByCode(rates, roomCode);
        if (roomObj && Array.isArray(roomObj.rates) && roomObj.rates.length > 0) {
            const lowestRate = this.findLowestRate(roomObj.rates);
            const formatedPrice = this.formatPrice(lowestRate?.averageNightlyAmountAfterTax);
            roomPricingElement.setAttribute('price', formatedPrice.toString());
            console.log(`Price for room ${roomCode} set to: ${formatedPrice}`);
        } else {
            roomPricingElement.setAttribute('price', 0);
            console.warn(`No rates found for room code: ${roomCode}`);
        }
        roomPricingElement.setAttribute('loading', 'false');
    }

    findRoomByCode(rates, roomCode) {
        return rates.find((r) => r.room && r.room.code === roomCode);
    }

    findLowestRate(rates) {
        return rates.reduce((min, rate) => {
            const minValue = min?.averageNightlyAmountAfterTax?.value ?? Infinity;
            const rateValue = rate?.averageNightlyAmountAfterTax?.value ?? Infinity;
            return rateValue < minValue ? rate : min;
        }, null);
    }

    formatPrice(rate) {
        console.log('Formatting price for rate:', rate);
        if (!rate || typeof rate.value !== 'number' || typeof rate.decimal !== 'number' || !rate.currencyCode) {
            return '';
        }
        const amount = (rate.value / Math.pow(10, rate.decimal)).toLocaleString(undefined, { minimumFractionDigits: rate.decimal });
        const currencyCode = rate.currencyCode;

        // Currency symbol mapping and placement (true = before, false = after)
        const currencyFormats = {
            EUR: { symbol: '€', before: false },
            USD: { symbol: '$', before: true },
            GBP: { symbol: '£', before: true },
            SEK: { symbol: 'kr', before: false },
            NOK: { symbol: 'kr', before: false },
            DKK: { symbol: 'kr', before: false },
            JPY: { symbol: '¥', before: true }
        };
        const format = currencyFormats[currencyCode] || { symbol: currencyCode, before: true };
        const formattedPrice = format.before ? `${format.symbol}${amount}` : `${amount} ${format.symbol}`;
        return formattedPrice;
    }


    async fetchAvaibilities() {
        if (!this.APIendpoint || !this.hotelRefId) {
            console.error('API endpoint is not provided');
            return [];
        }
        // Retrieve check-in and check-out dates from sessionStorage, fallback to empty string if not found
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
                "adults": 1,
                "children": 0,
                "childrenAges": [],
                "accessible": false
            },
            locale: {
                language: this.locale || "en",
            },
            availabilityOptions: {
                withCostBreakdown: true
            }
        };

        try {
            const response = await fetch(this.APIendpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'opYAfmo0DAyog7t6rPLX'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            return data && data.rooms ? data.rooms : [];
        } catch (error) {
            console.error('Error fetching prices', error);
            return [];
        }
    }
}

customElements.define('irnmn-price-syncing', IrnmnPriceSyncing);
