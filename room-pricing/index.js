class IrnmnRoomPricing extends HTMLElement {

    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return [
            'price',
            'loading'
        ];
    }

    attributeChangedCallback() {
        this.render();
    }

    get roomCode() {
        return this.getAttribute('room-code') || '';
    }

    get checkinDateName() {
        return this.getAttribute('checkin-date-name') || '';
    }

    get checkoutDateName() {
        return this.getAttribute('checkout-date-name') || '';
    }

    get dateLocale() {
        return this.getAttribute('date-locale') || '';
    }

    get dateName() {
        return this.getAttribute('date-name') || 'date-selection';
    }

    get loading() {
        const loadingAttr = this.getAttribute('loading');
        if (loadingAttr === "true" || loadingAttr === "1") {
            return true;
        }
        return false;
    }

    get price() {
        const priceAttr = this.getAttribute('price');
        if (priceAttr === "false" || priceAttr === "0") {
            return false;
        }
        return priceAttr || false;
    }

    get labels() {
        try {
            return JSON.parse(this.getAttribute('labels')) || {};
        } catch {
            return {};
        }
    }

    render() {
        const labels = this.labels;
        // Retrieve check-in and check-out dates from sessionStorage, fallback to empty string if not found
        const checkinDateKey = `irnmn-${this.checkinDateName}-${this.dateName}`;
        const checkoutDateKey = `irnmn-${this.checkoutDateName}-${this.dateName}`;
        const checkinDate = window.sessionStorage.getItem(checkinDateKey) || false;
        const checkoutDate = window.sessionStorage.getItem(checkoutDateKey) || false;

        let label = "false";
        if (!checkinDate || !checkoutDate) {
            label = labels.placeholder || 'Select dates for prices';
        }
        if (!this.price && checkinDate && checkoutDate) {
            label = labels.noRatesMessage || 'Select other dates for prices';
        }

        this.innerHTML = `
            <irnmn-calendar
                class="irnmn-room-pricing__calendar"
                label="${label}"
                heading-label="${labels.heading || 'Select dates'}"
                placeholder="false"
                format-date-values="YYYY-MM-DD"
                opening-date="false"
                show-error="false"
                input-name="date-selection"
                checkin-date-name="${this.checkinDateName}"
                checkout-date-name="${this.checkoutDateName}"
                name="${this.dateName}"
                weekdays="M,T,W,T,F,S,S"
                date-locale="${this.dateLocale}"
            >
            </irnmn-calendar>

            ${!this.loading
                ? `
                    ${!this.price && checkinDate && checkoutDate
                    ? `<div class="irnmn-room-pricing__noavailable">
                            ${labels.noRates || 'No price available for the selected dates'}
                        </div>`
                    : ''
                }
                    ${this.price && checkinDate && checkoutDate
                    ? `<div class="irnmn-room-pricing__price">
                            ${labels.from}
                            <span class="irnmn-room-pricing__price-value">${this.price}/${labels.night}</span>
                            ${labels.legalText ? `<span class="irnmn-room-pricing__mention">${labels.legalText}</span>` : ''}
                        </div>`
                    : ''
                }
                `
                : `
                    <div class="irnmn-room-pricing__loading">
                        <irnmn-spinner></irnmn-spinner>
                        <span>${labels.loading || 'Loading...'}</span>
                    </div>
                `
            }
        `;
    }
}

customElements.define('irnmn-room-pricing', IrnmnRoomPricing);
