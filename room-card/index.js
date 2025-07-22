/**
 * @class IrnmnRoomCard
 * @classdesc Custom element representing a room card with slider, pricing, amenities, and modal details.
 */
class IrnmnRoomCard extends HTMLElement {
    /**
     * List of attributes to observe for changes.
     */
    static get observedAttributes() {
        return [
            'title',
            'description',
            'badge-label',
            'images',
            'extras',
            'room-amenities',
            'hotel-amenities',
            'link-360',
            'arrow-svg',
        ];
    }

    /**
     * Constructs the IrnmnRoomCard element and assigns a unique ID.
     */
    constructor() {
        super();
        // Unique id for this room card, useful for accessibility and modal identification
        this.uniqueId = `card-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * @returns {string} Room code identifier.
     */
    get roomCode() {
        return this.getAttribute('room-code') || '';
    }

    /**
     * @returns {string} Room title.
     */
    get title() {
        return this.getAttribute('title') || '';
    }

    /**
     * @returns {string} Room description.
     */
    get description() {
        return this.getAttribute('description') || '';
    }

    /**
     * @returns {Array<string|Object>} Array of image URLs or objects.
     */
    get images() {
        try {
            return JSON.parse(this.getAttribute('images') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * @returns {string} Badge label for the room card.
     */
    get badgeLabel() {
        return this.getAttribute('badge-label') || '';
    }

    /**
     * @returns {Array<string>} Array of extra features.
     */
    get extras() {
        try {
            return JSON.parse(this.getAttribute('extras') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * @returns {Array<string>} Array of room amenities.
     */
    get roomAmenities() {
        try {
            return JSON.parse(this.getAttribute('room-amenities') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * @returns {Array<string>} Array of hotel amenities.
     */
    get hotelAmenities() {
        try {
            return JSON.parse(this.getAttribute('hotel-amenities') || '[]');
        } catch {
            return [];
        }
    }

    /**
     * @returns {string} URL to 360 tour.
     */
    get link360() {
        return this.getAttribute('link-360') || '';
    }

    /**
     * @returns {Object} Labels for UI elements.
     */
    get labels() {
        try {
            return JSON.parse(this.getAttribute('labels') || '{}');
        } catch {
            return {};
        }
    }

    get arrowSvg() {
        return (
            this.getAttribute('arrow-svg') ||
            `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="32" viewBox="0 0 18 32" fill="none">
            <path d="M1.44922 31L16.4492 16L1.44922 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
        );
    }

    /**
     * Lifecycle method called when the element is added to the DOM.
     * Renders the component and adds event listeners.
     */
    connectedCallback() {
        this.render();
        this.addListeners();
    }

    /**
     * Called when one of the observed attributes changes.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        // Only re-render if the value actually changed
        if (oldValue !== newValue) {
            this.render();
            this.addListeners();
        }
    }

    /**
     * Adds event listeners for modal expansion and slider refresh.
     * @private
     */
    addListeners() {
        const expandButtons = this.querySelectorAll('.expand-room-modal');
        const sliderFigures = this.querySelectorAll('irnmn-slider figure');
        const modal = this.querySelector('.room-modal');
        if ((!expandButtons.length && !sliderFigures.length) || !modal) return;

        // Helper for click vs drag detection
        function addClickOnlyListener(element, handler) {
            let isDragging = false;
            let startX = 0;
            let startY = 0;
            let threshold = 10; // px

            element.addEventListener('pointerdown', (e) => {
                isDragging = false;
                startX = e.clientX;
                startY = e.clientY;
            });

            element.addEventListener('pointermove', (e) => {
                if (
                    Math.abs(e.clientX - startX) > threshold ||
                    Math.abs(e.clientY - startY) > threshold
                ) {
                    isDragging = true;
                }
            });

            element.addEventListener('pointerup', (e) => {
                if (!isDragging) {
                    handler(e);
                }
            });

            element.addEventListener('dragstart', () => {
                isDragging = true;
            });
        }

        // DRY: open modal, refresh slider, set up modal book button close
        function openModalAndSetup(modal) {
            modal.open();
            const modalBookButtons = modal.querySelectorAll('.--book-button');
            modalBookButtons.forEach((button) => {
                button.removeEventListener('click', button._modalCloseHandler);
                button._modalCloseHandler = () => {
                    modal.close();
                };
                button.addEventListener('click', button._modalCloseHandler);
            });
        }

        expandButtons.forEach((expandButton) => {
            expandButton.addEventListener('click', () =>
                openModalAndSetup(modal),
            );
        });

        sliderFigures.forEach((figure) => {
            addClickOnlyListener(figure, () => openModalAndSetup(modal));
        });
    }

    /**
     * Renders the image slider HTML.
     * @returns {string} HTML string for the slider.
     * @private
     */
    renderSlider() {
        return `
            <irnmn-slider class="room-card__slider" selectors='{
                "SWIPE_CONTAINER": ".room-card__slider-container",
                "SLIDES": ".room-card__slider-slide",
                "NAVIGATION": ".room-card__slider-navigation",
                "PREV_BUTTON": ".room-card__slider-prev",
                "NEXT_BUTTON": ".room-card__slider-next"
            }'>
                <div class="room-card__slider-container" aria-polite="true" aria-label="${this.labels.slideraria || 'Room images'}">
                    ${this.images
                        .map((img) => {
                            if (typeof img === 'string') {
                                return `<div class="room-card__slider-slide"><figure><img src="${img}" alt="Room image"></figure></div>`;
                            } else if (img && typeof img === 'object') {
                                return `<div class="room-card__slider-slide"><figure><img src="${img.url}" alt="${img.alt || 'Room image'}"></figure></div>`;
                            }
                            return '';
                        })
                        .join('')}
                </div>
                <div class="room-card__slider-navigation">
                    <button class="room-card__slider-prev" aria-label="${this.labels.prevSlide || 'See previous image'}">
                        ${this.arrowSvg}
                    </button>
                    <button class="room-card__slider-next" aria-label="${this.labels.nextSlide || 'See next image'}">
                        ${this.arrowSvg}
                    </button>
                </div>
                <div class="room-card__slider-indicators">
                    <ul aria-hidden="true">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>
                ${
                    this.link360
                        ? `
                    <a href="${this.link360}" target="_blank" class="room-card__slider-360" aria-label="${this.labels.view360aria || 'View 360 tour'}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16" fill="none">
                        <path d="M10.9016 6.58242V2.85742C10.9016 2.45742 10.6766 2.10742 10.3266 1.95742L7.42656 0.607422C7.15156 0.482422 6.85156 0.482422 6.57656 0.607422L3.67656 1.95742C3.32656 2.13242 3.10156 2.48242 3.10156 2.85742V6.58242C3.10156 6.93242 3.30156 7.28242 3.60156 7.45742L6.50156 9.13242C6.65156 9.23242 6.82656 9.25742 7.00156 9.25742C7.17656 9.25742 7.35156 9.20742 7.50156 9.13242L10.4016 7.45742C10.7266 7.28242 10.9016 6.95742 10.9016 6.58242ZM6.80156 1.05742C6.85156 1.03242 6.92656 1.00742 7.00156 1.00742C7.07656 1.00742 7.15156 1.03242 7.20156 1.05742L10.0766 2.38242L7.00156 3.80742L3.92656 2.38242L6.80156 1.05742ZM3.85156 7.03242C3.70156 6.93242 3.60156 6.78242 3.60156 6.60742V2.85742C3.60156 2.83242 3.60156 2.80742 3.60156 2.78242L6.75156 4.23242V8.68242L3.85156 7.03242ZM10.1516 7.03242L7.25156 8.70742V4.23242L10.4016 2.78242C10.4016 2.80742 10.4016 2.83242 10.4016 2.85742V6.58242C10.4016 6.75742 10.3266 6.93242 10.1516 7.03242Z" fill="white" style="fill:white;fill-opacity:1;"/>
                        <path d="M5.72578 14.3074C5.85078 14.3074 5.97578 14.2074 5.97578 14.0574C5.97578 13.9074 5.87578 13.8074 5.72578 13.8074C2.67578 13.6574 0.800781 12.8574 0.800781 12.1574C0.800781 11.7074 1.77578 11.0324 3.92578 10.7074C4.05078 10.6824 4.15078 10.5574 4.12578 10.4324C4.10078 10.3074 3.97578 10.2074 3.85078 10.2324C1.62578 10.5824 0.300781 11.3074 0.300781 12.1824C0.300781 13.4574 3.10078 14.1824 5.72578 14.3074Z" fill="white" style="fill:white;fill-opacity:1;"/>
                        <path d="M10.6017 10.2822C10.4767 10.2572 10.3267 10.3572 10.3017 10.4822C10.2767 10.6072 10.3767 10.7572 10.5017 10.7822C12.3767 11.1322 13.2017 11.7322 13.2017 12.1572C13.2017 12.7322 11.7767 13.4822 9.12666 13.7322C9.00166 13.7572 8.87666 13.8572 8.90166 14.0072C8.90166 14.1322 9.02666 14.2322 9.15166 14.2322H9.17666C11.2767 14.0322 13.7017 13.3572 13.7017 12.1572C13.7017 11.3572 12.5767 10.6822 10.6017 10.2822Z" fill="white" style="fill:white;fill-opacity:1;"/>
                        <path d="M5.60078 12.6072C5.50078 12.5322 5.35078 12.5322 5.25078 12.6322C5.15078 12.7322 5.17578 12.8822 5.27578 12.9822L6.40078 13.9572L5.25078 15.1322C5.15078 15.2322 5.15078 15.3822 5.25078 15.4822C5.30078 15.5322 5.37578 15.5572 5.42578 15.5572C5.47578 15.5572 5.55078 15.5322 5.60078 15.4822L6.95078 14.1322C7.00078 14.0822 7.02578 14.0072 7.02578 13.9572C7.02578 13.9072 7.00078 13.8322 6.95078 13.7822L5.60078 12.6072Z" fill="white" style="fill:white;fill-opacity:1;"/>
                        </svg>
                        ${this.labels.view360 || '360 tour'}
                    </a>
                `
                        : ''
                }
                ${this.badgeLabel ? `<span class="room-card__badge">${this.badgeLabel}</span>` : ''}
            </irnmn-slider> `;
    }

    /**
     * Renders the pricing component HTML.
     * @returns {string} HTML string for pricing.
     * @private
     */
    renderPricing() {
        return `
        <div class="room-card__pricing">
            <button class="room-card__pricing-cta btn --book-button" aria-label="${this.labels.bookaria || 'Book this room'}">${this.labels.book || 'BOOK'}</button>
        </div>
        `;
    }

    /**
     * Renders the extras list HTML.
     * @param {boolean} moreButton - Whether to include the "more info" button.
     * @returns {string} HTML string for extras.
     * @private
     */
    renderExtras(moreButton = true) {
        return `
            <div class="room-card__extras">
                <p class="room-card__extras__list" role="list">
                    ${this.extras.map((extra) => `<span role="listitem">${extra}</span>`).join('')}
                </p>
                ${
                    moreButton
                        ? `<button aria-label="${this.labels.more || 'More info'}" class="btn btn-secondary expand-room-modal">${this.labels.more || 'More info'}</button>`
                        : ''
                }
            </div>
        `;
    }

    /**
     * Renders an amenities list section.
     * @param {Array<string>} list - List of amenities.
     * @param {string} label - Section label.
     * @param {string} className - Additional class name.
     * @returns {string} HTML string for amenities.
     * @private
     */
    renderAmenities(list, label, className) {
        if (!Array.isArray(list) || list.length === 0) {
            return '';
        }
        return `
            <div class="room-card__amenities ${className}">
                <h4 class="room-card__amenities-title">${label}</h4>
                <ul class="room-card__amenities-list">
                    ${list.map((amenity) => `<li class="amenity">${amenity}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    /**
     * Renders the entire room card and modal HTML.
     * @private
     */
    render() {
        const roomSliderHTML = this.renderSlider();
        const roomPricingHTML = this.renderPricing();
        const roomAmenitiesHTML = this.renderAmenities(
            this.roomAmenities,
            this.labels.roomAmenities || 'Room Amenities',
            '--room-amenities',
        );
        const hotelAmenitiesHTML = this.renderAmenities(
            this.hotelAmenities,
            this.labels.hotelAmenities || 'Hotel Amenities',
            '--hotel-amenities',
        );

        this.innerHTML = `
            <div class="room-card">
                ${roomSliderHTML}
                <div class="room-card__content">
                    <h2 class="room-card__title">${this.title}</h2>
                    ${this.renderExtras(true)}
                    ${roomPricingHTML}
                    <p class="room-card__description">${this.description}</p>
                </div>
            </div>

            <irnmn-modal class="room-modal" modal-content="template" modal-close="${this.labels.close || 'Close'}" labelledby="room-modal-title__${this.uniqueId}">
                <template>
                    <div class="room-modal__inner">
                        ${roomSliderHTML}
                        <div class="room-card__content">
                            <div class="room-modal__header">
                                <h2 class="room-card__title" id="room-modal-title__${this.uniqueId}">${this.title}</h2>
                                ${roomPricingHTML}
                            </div>
                            ${this.renderExtras(false)}
                            <p class="room-card__description">${this.description}</p>
                            ${roomPricingHTML}
                            ${roomAmenitiesHTML}
                            ${hotelAmenitiesHTML}
                        </div>
                    </div>
                </template>
            </irnmn-modal>
        `;
    }
}
if (!customElements.get('irnmn-room-card')) {
    customElements.define('irnmn-room-card', IrnmnRoomCard);
}
