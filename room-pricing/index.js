/**
 * Custom element for displaying room pricing with date selection.
 */
class IrnmnRoomPricing extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static get observedAttributes() {
        return ['price', 'loading'];
    }

    /**
     * Re-render on attribute changes.
     */
    attributeChangedCallback() {
        this.render();
    }

    /** @returns {string} */
    get roomCode() {
        return this.getAttribute('room-code') || '';
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
    get dateLocale() {
        return this.getAttribute('date-locale') || '';
    }

    /** @returns {string} */
    get dateName() {
        return this.getAttribute('date-name') || 'date-selection';
    }

    /** @returns {boolean} */
    get loading() {
        const loadingAttr = this.getAttribute('loading');
        return loadingAttr === 'true' || loadingAttr === '1';
    }

    /** @returns {string|false} */
    get price() {
        const priceAttr = this.getAttribute('price');
        if (priceAttr === 'false' || priceAttr === '0') {
            return false;
        }
        return priceAttr || false;
    }

    /** @returns {object} */
    get labels() {
        try {
            return JSON.parse(this.getAttribute('labels')) || {};
        } catch {
            return {};
        }
    }

    /**
     * Render the component.
     */
    render() {
        const labels = this.labels;
        const checkinDateKey = `irnmn-${this.checkinDateName}-${this.dateName}`;
        const checkoutDateKey = `irnmn-${this.checkoutDateName}-${this.dateName}`;
        const checkinDate = window.sessionStorage.getItem(checkinDateKey) || '';
        const checkoutDate = window.sessionStorage.getItem(checkoutDateKey) || '';

        let calendarLabel = 'false';
        if (!checkinDate || !checkoutDate) {
            calendarLabel = labels.placeholder || 'Select dates for prices';
        } else if (!this.price) {
            calendarLabel = labels.noRatesMessage || 'Select other dates for prices';
        }

        this.innerHTML = `
            <irnmn-calendar
                class="irnmn-room-pricing__calendar"
                label="${calendarLabel}"
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
            ></irnmn-calendar>
            ${this.loading
                ? `
                    <div class="irnmn-room-pricing__loading">
                        <irnmn-spinner></irnmn-spinner>
                        <span>${labels.loading || 'Loading...'}</span>
                    </div>
                `
                : `
                    ${!this.price && checkinDate && checkoutDate
                    ? `<div class="irnmn-room-pricing__noavailable">
                                ${labels.noRates || 'No price available for the selected dates'}
                            </div>`
                    : ''
                }
                    ${this.price && checkinDate && checkoutDate
                    ? `<div class="irnmn-room-pricing__price">
                                ${labels.from || ''}
                                <span class="irnmn-room-pricing__price-value">${this.price}/${labels.night || ''}</span>
                                ${labels.legalText ? `<span class="irnmn-room-pricing__mention">${labels.legalText}</span>` : ''}
                            </div>`
                    : ''
                }
                `
            }
        `;
    }
}

customElements.define('irnmn-room-pricing', IrnmnRoomPricing);
