/**
 * Custom Web Component representing a booking popup.
 * @class IRNMNBookingPopup
 * @extends {HTMLElement}
 */
class IRNMNBookingPopup extends HTMLElement {
    /**
     * Constructor for the IRNMNBookingPopup component.
     */
    constructor() {
        super();
        this.lastFocusedElement = null; // To store the last focused element before opening the modal
    }

    /**
     * Lifecycle method called when the element is added to the DOM.
     * Initializes the form and sets up the booking popup.
     */
    connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        this.renderBookingPopup();
        this.form.addEventListener('submit', (event) =>
            this.handleBookingPopup(event),
        );
    }

    /**
     * Lifecycle method called when the element is removed from the DOM.
     * Cleans up event listeners.
     */
    disconnectedCallback() {
        if (!this.form) return;
        this.form.removeEventListener('submit', this.handleBookingPopup);
    }

    /**
     * Renders the booking popup and sets up its attributes and event listeners.
     */
    renderBookingPopup() {
        this.setAttributes();
        if (!this.hasPopup) return; // Do nothing if the popup is disabled
        this.render();
        this.attachEventListeners();

        Promise.resolve().then(() => {
            this.dispatchEvent(
                new CustomEvent('irnmn-popup-loaded', {
                    detail: { element: this },
                }),
            );
        });
    }

    /**
     * Sets the attributes for the booking popup, such as labels and timer.
     */
    setAttributes() {
        this.hasPopup = this.getHasPopup();
        this.labels = this.getLabels();
        this.timer = this.getTimer();
        this.useCSS = this.getUseCSS();
    }

    /**
     * Retrieves the form ID from the component's attributes.
     * @returns {string|null} The form ID or null if not set.
     */
    get formId() {
        return this.getAttribute('form-id') || null;
    }

    /**
     * Retrieves the labels for the booking popup, merging default and custom labels.
     * @returns {Object} An object containing the labels for the popup.
     */
    getLabels() {
        const defaultLabels = {
            title: 'You will be redirected',
            text: 'Click continue to proceed to the booking engine',
            cta: 'Continue',
            close: 'Close',
        };
        const customLabels = JSON.parse(this.getAttribute('labels')) || {};
        return { ...defaultLabels, ...customLabels };
    }

    /**
     * Retrieves and validates the timer value from the component's attributes.
     * @returns {number|false} The timer value as a positive integer or false if invalid.
     */
    getTimer() {
        const timer = parseInt(this.getAttribute('timer'), 10);
        return isNaN(timer) || timer <= 0 ? false : timer;
    }

    /**
     * Retrieves the has-popup attribute from the component's attributes.
     * @returns {boolean} The value of the has-popup attribute.
     * @default false
     */
    getHasPopup() {
        const hasPopupAttr = this.getAttribute('has-popup');
        return (
            hasPopupAttr === 'true' ||
            (hasPopupAttr !== 'false' &&
                hasPopupAttr !== 'null' &&
                hasPopupAttr)
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

    static get observedAttributes() {
        return ['labels', 'timer', 'has-popup', 'use-css-display'];
    }

    /**
     * Lifecycle method called when observed attributes change.
     * @param {string} name - The name of the changed attribute.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderBookingPopup();
        }
    }

    /**
     * Renders the HTML structure of the booking popup.
     */
    render() {
        const showButton = this.timer === false;
        const timerValue = this.timer
            ? `<div class="irnmn-booking-popup__timer"><span>${this.timer}</span>sec</div>`
            : '';
        const button = showButton
            ? `<button class="irnmn-booking-popup__cta">${this.labels.cta}</button>`
            : '';

        this.innerHTML = `
            <dialog class="irnmn-booking-popup" role="dialog" aria-modal="true" aria-hidden="true" style="${this.useCSS ? 'display: none;' : ''}" tabindex="-1">
                <div class="irnmn-booking-popup__container">
                    <button class="irnmn-booking-popup__close" aria-label="${this.labels.close}">${this.labels.close}</button>
                    <h2 class="irnmn-booking-popup__title">${this.labels.title}</h2>
                    ${this.labels.text ? `<p class="irnmn-booking-popup__text">${this.labels.text}</p>` : ''}
                    ${showButton ? button : timerValue}
                </div>
            </dialog>
        `;
    }

    /**
     * Attaches event listeners to the booking popup, such as the close button.
     */
    attachEventListeners() {
        const modal = this.querySelector('.irnmn-booking-popup');
        if (!modal) return;

        // Add event listener to the continue button if the timer is not set
        if (this.timer === false) {
            const button = modal.querySelector('.irnmn-booking-popup__cta');
            if (!button) return;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // Submit the form without showing the popup
                this.form.submit();
            });
        }

        // Add event listener to the close button
        const closeButton = modal.querySelector('.irnmn-booking-popup__close');
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
     * Handles the form submission event to display the booking popup.
     * @param {Event} e - The form submission event.
     */
    handleBookingPopup(e) {
        if (!this.hasPopup) return; // Do nothing if the popup is disabled

        e.preventDefault();

        // Get the modal element
        const modal = this.querySelector('.irnmn-booking-popup');
        if (!modal) return;

        // Save the last focused element
        this.lastFocusedElement = document.activeElement;

        // Show the modal
        modal.classList.add('irnmn-booking-popup--visible');
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

        // Dispatch an event to notify the popup has been opened
        this.dispatchEvent(
            new CustomEvent('irnmn-popup-opened', {
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
        modal.classList.remove('irnmn-booking-popup--visible');
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

        // Dispatch an event to notify the popup has been closed
        this.dispatchEvent(
            new CustomEvent('irnmn-popup-closed', {
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
     * Starts the timer for the booking popup.
     * Displays a countdown in the span and submits the form when it reaches zero.
     */
    startTimer() {
        const modal = this.querySelector('.irnmn-booking-popup');
        if (!modal) return;

        const timer = modal.querySelector('.irnmn-booking-popup__timer');
        if (!timer) return;

        let timeLeft = this.timer;
        const timerValue = timer.querySelector('span');

        this.timerInterval = setInterval(() => {
            timeLeft -= 1;
            timerValue.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);

                // Hide the popup immediately
                modal.setAttribute('aria-hidden', 'true');
                modal.setAttribute('tabindex', '-1');
                modal.classList.remove('irnmn-booking-popup--visible');
                if (this.useCSS) {
                    modal.style.display = 'none';
                }

                // Submit the form
                this.form.submit();
            }
        }, 1000);
    }

    /**
     * Stops the timer for the booking popup.
     */
    stopTimer() {
        clearInterval(this.timerInterval);

        // Reset the timer value
        const modal = this.querySelector('.irnmn-booking-popup');
        if (!modal) return;

        const timer = modal.querySelector('.irnmn-booking-popup__timer span');
        if (!timer) return;
        timer.textContent = this.timer;
    }
}

customElements.define('irnmn-booking-popup', IRNMNBookingPopup);
