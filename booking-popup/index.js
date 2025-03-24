/**
 * Custom Web Component representing a booking modal.
 * @class IRNMNBookingModal
 * @extends {HTMLElement}
 */
class IRNMNBookingModal extends HTMLElement {
    /**
     * Constructor for the IRNMNBookingModal component.
     */
    constructor() {
        super();
        this.lastFocusedElement = null; // To store the last focused element before opening the modal
    }

    /**
     * Lifecycle method called when the element is added to the DOM.
     * Initializes the form and sets up the booking modal.
     */
    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.renderBookingModal();
        this.form.addEventListener('submit', (event) =>
            this.handleBookingModal(event),
        );
    }

    /**
     * Lifecycle method called when the element is removed from the DOM.
     * Cleans up event listeners.
     */
    disconnectedCallback() {
        if (!this.form) return;
        this.form.removeEventListener('submit', this.handleBookingModal);
    }

    /**
     * Renders the booking modal and sets up its attributes and event listeners.
     */
    renderBookingModal() {
        this.setAttributes();
        if (!this.hasModal) return; // Do nothing if the modal is disabled
        this.render();
        this.attachEventListeners();

        Promise.resolve().then(() => {
            this.dispatchEvent(
                new CustomEvent('irnmn-modal-loaded', {
                    detail: { element: this },
                }),
            );
        });
    }

    /**
     * Sets the attributes for the booking modal, such as labels and timer.
     */
    setAttributes() {
        this.hasModal = this.getHasModal();
        this.titleLabel = this.getTitleLabel();
        this.textLabel = this.getTextLabel();
        this.ctaLabel = this.getCTALabel();
        this.closeLabel = this.getCloseLabel();
        this.timer = this.getTimer();
        this.useCSS = this.getUseCSS();
        this.imageSrc = this.getImageSrc();
    }

    /**
     * Retrieves the form ID from the component's attributes.
     * @returns {string|null} The form ID or null if not set.
     */
    get formId() {
        return this.getAttribute('form-id') || null;
    }

    /**
     * Retrieves the title for the booking modal.
     * @returns {string} The title for the modal.
     */
    getTitleLabel() {
        return this.getAttribute('title') || 'You will be redirected';
    }

    /**
     * Retrieves the text for the booking modal.
     * @returns {string} The text for the modal.
     */
    getTextLabel() {
        return this.getAttribute('text') || 'Click continue to proceed to the booking engine';
    }

    /**
     * Retrieves the CTA label for the booking modal.
     * @returns {string} The CTA label for the modal.
     */
    getCTALabel() {
        return this.getAttribute('cta') || 'Continue';
    }

    /**
     * Retrieves the close label for the booking modal.
     * @returns {string} The close label for the modal.
     */
    getCloseLabel() {
        return this.getAttribute('close') || 'Close';
    }

    /**
     * Retrieves and validates the timer value from the component's attributes.
     * @returns {number|false} The timer value as a positive integer or false if invalid.
     */
    getTimer() {
        const timer = parseInt(this.getAttribute('modal-timer'), 10);
        return isNaN(timer) || timer <= 0 ? false : timer;
    }

    /**
     * Retrieves the has-modal attribute from the component's attributes.
     * @returns {boolean} The value of the has-modal attribute.
     * @default false
     */
    getHasModal() {
        const hasModalAttr = this.getAttribute('has-modal');
        return (
            hasModalAttr === 'true' ||
            (hasModalAttr !== 'false' &&
                hasModalAttr !== 'null' &&
                hasModalAttr)
        );
    }

    /**
     * Retrieves the use-css-display attribute from the component's attributes.
     * @returns {boolean} The value of the use-css-display attribute.
     * @default true
     */
    getUseCSS() {
        const useCSSAttr = this.getAttribute('use-css-display');
        return (
            useCSSAttr === 'true' ||
            (useCSSAttr !== 'false' &&
                useCSSAttr !== 'null' &&
                useCSSAttr)
        );
    }

    /**
     * Retrieves the image-src attribute from the component's attributes.
     * @returns {string|null} The value of the image-src attribute or null if not set.
     */
    getImageSrc() {
        return this.getAttribute('modal-image') || null;
    }

    static get observedAttributes() {
        return ['title', 'text', 'cta', 'close', 'timer', 'has-modal', 'use-css-display', 'image-src'];
    }

    /**
     * Lifecycle method called when observed attributes change.
     * @param {string} name - The name of the changed attribute.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderBookingModal();
        }
    }

    /**
     * Renders the HTML structure of the booking modal.
     */
    render() {
        const showButton = this.timer === false;
        const timerValue = this.timer
            ? `<div class="irnmn-booking-modal__timer"><span>${this.timer}</span>sec</div>`
            : '';
        const button = showButton
            ? `<button class="irnmn-booking-modal__cta">${this.ctaLabel}</button>`
            : '';
        const image = this.imageSrc
            ? `<img src="${this.imageSrc}" role="presentation" aria-hidden="true" class="irnmn-booking-modal__image">`
            : '';

        this.innerHTML = `
            <dialog class="irnmn-booking-modal" role="dialog" aria-modal="true" aria-hidden="true" style="${this.useCSS ? 'display: none;' : ''}" tabindex="-1">
                <div class="irnmn-booking-modal__container">
                    <button class="irnmn-booking-modal__close" aria-label="${this.closeLabel}">${this.closeLabel}</button>
                    <h2 class="irnmn-booking-modal__title">${this.titleLabel}</h2>
                    ${this.textLabel ? `<p class="irnmn-booking-modal__text">${this.textLabel}</p>` : ''}
                    ${showButton ? button : timerValue}
                    ${image}
                </div>
            </dialog>
        `;
    }

    /**
     * Attaches event listeners to the booking modal, such as the close button.
     */
    attachEventListeners() {
        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        // Add event listener to the continue button if the timer is not set
        if (this.timer === false) {
            const button = modal.querySelector('.irnmn-booking-modal__cta');
            if (!button) return;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // Submit the form without showing the modal
                this.form.submit();
            });
        }

        // Add event listener to the close button
        const closeButton = modal.querySelector('.irnmn-booking-modal__close');
        if (!closeButton) return;

        closeButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the form submission

            // Close the modal
            this.closeModal(modal);
        });

        // Add focus trapping
        modal.addEventListener('keydown', (e) => this.trapFocus(e, modal));

        // Add event listener for Escape key to close the modal
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeModal(modal);
            }
        });
    }

    /**
     * Handles the form submission event to display the booking modal.
     * @param {Event} e - The form submission event.
     */
    handleBookingModal(e) {
        if (!this.hasModal) return; // Do nothing if the modal is disabled

        e.preventDefault();

        // Get the modal element
        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        // Save the last focused element
        this.lastFocusedElement = document.activeElement;

        // Show the modal
        modal.classList.add('irnmn-booking-modal--visible');
        modal.setAttribute('aria-hidden', 'false');
        modal.setAttribute('tabindex', '0');
        if (this.useCSS) {
            modal.style.display = 'block';
        }

        // Update attributes for accessibility compliance
        this.setAttribute('aria-live', 'assertive');
        this.setAttribute('role', 'alertdialog');

        // Focus the first focusable element inside the modal
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        // Start the timer if it's set
        if (this.timer) {
            this.startTimer();
        }

        // Dispatch an event to notify the modal has been opened
        this.dispatchEvent(
            new CustomEvent('irnmn-modal-opened', {
                detail: { element: this },
            }),
        );
    }

    /**
     * Closes the modal and restores focus to the last focused element.
     * @param {HTMLElement} modal - The modal element to close.
     */
    closeModal(modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');
        modal.classList.remove('irnmn-booking-modal--visible');
        if (this.useCSS) {
            modal.style.display = 'none';
        }

        // Update attributes for accessibility compliance
        this.setAttribute('aria-live', 'off');
        this.setAttribute('role', 'alert');

        // Stop the timer
        this.stopTimer();

        // Restore focus to the last focused element
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }

        // Dispatch an event to notify the modal has been closed
        this.dispatchEvent(
            new CustomEvent('irnmn-modal-closed', {
                detail: { element: this },
            }),
        );
    }

    /**
     * Traps focus inside the modal when it is open.
     * @param {KeyboardEvent} e - The keyboard event.
     * @param {HTMLElement} modal - The modal element.
     */
    trapFocus(e, modal) {
        if (e.key !== 'Tab') return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Starts the timer for the booking modal.
     * Displays a countdown in the span and submits the form when it reaches zero.
     */
    startTimer() {
        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        const timer = modal.querySelector('.irnmn-booking-modal__timer');
        if (!timer) return;

        let timeLeft = this.timer;
        const timerValue = timer.querySelector('span');

        this.timerInterval = setInterval(() => {
            timeLeft -= 1;
            timerValue.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);

                // Hide the modal immediately
                modal.setAttribute('aria-hidden', 'true');
                modal.setAttribute('tabindex', '-1');
                modal.classList.remove('irnmn-booking-modal--visible');
                if (this.useCSS) {
                    modal.style.display = 'none';
                }

                // Submit the form
                this.form.submit();
            }
        }, 1000);
    }

    /**
     * Stops the timer for the booking modal.
     */
    stopTimer() {
        clearInterval(this.timerInterval);

        // Reset the timer value
        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        const timer = modal.querySelector('.irnmn-booking-modal__timer span');
        if (!timer) return;
        timer.textContent = this.timer;
    }
}

customElements.define('irnmn-booking-modal', IRNMNBookingModal);
