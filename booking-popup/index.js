/**
 * Booking Popup Component
 * Wrapper around PopupComponent, adding booking-specific functionality.
 * Includes timer functionality, form validation, has-modal handling, and handling of form submission.
 * @class IRNMNBookingModal
 * @extends {IRNMNPopup}
 */

import { IRNMNPopup } from '../popup/index.js';

class IRNMNBookingModal extends IRNMNPopup {
    /**
     * Constructor for IRNMNBookingModal
     * Extends PopupComponent to provide booking-specific functionalities.
     */
    constructor() {
        super();
        this.timerInterval = null; // Stores the reference to the timer interval for clearing it later
    }

    /**
     * Retrieves the form ID from the component's attributes.
     * @returns {string|null} The form ID or null if not set.
     */
    get formId() {
        return this.getAttribute('form-id') || null;
    }

    /**
     * Retrieves and validates the timer value from the component's attributes.
     * @returns {number|false} The timer value as a positive integer or false if invalid.
     */
    get timer() {
        const timer = parseInt(this.getAttribute('modal-timer'), 10);
        return isNaN(timer) || timer <= 0 ? false : timer;
    }

    /**
     * Retrieves whether the modal should be shown based on the 'has-modal' attribute.
     * @returns {boolean} True if the modal is enabled, false otherwise.
     */
    get hasModal() {
        const hasModalAttr = this.getAttribute('has-modal');
        return (
            hasModalAttr === 'true' ||
            (hasModalAttr !== 'false' &&
                hasModalAttr !== 'null' &&
                hasModalAttr)
        );
    }

    /**
     * Retrieves whether the form requires validation before showing the modal.
     * @returns {boolean} True if validation is required, false otherwise.
     */
    get formNeedValidation() {
        const formNeedValidationAttr = this.getAttribute(
            'form-need-validation',
        );
        return (
            formNeedValidationAttr === 'true' ||
            formNeedValidationAttr === null ||
            (formNeedValidationAttr !== 'false' &&
                formNeedValidationAttr !== 'null' &&
                formNeedValidationAttr)
        );
    }

    /**
     * Called when the element is added to the DOM.
     * Binds the booking form submission event and triggers the modal display when necessary.
     */
    async connectedCallback() {
        await super.connectedCallback();

        this.form = document.getElementById(this.formId);

        if (this.form) {
            this.form.addEventListener(
                'submit',
                this.handleBookingModal.bind(this),
            );
        }
    }

    /**
     * Called when the element is removed from the DOM.
     * Ensures event listeners and timers are properly cleared.
     */
    disconnectedCallback() {
        if (this.form) {
            this.form.removeEventListener(
                'submit',
                this.handleBookingModal.bind(this),
            );
        }
        this.stopTimer();
        super.disconnectedCallback();
    }

    static get observedAttributes() {
        // Combine parent class's observed attributes with new ones
        return [
            ...(super.observedAttributes || []),
            'has-modal',
            'modal-timer',
            'form-id',
            'form-need-validation',
        ];
    }

    async renderPopup() {
        if (!this.hasModal) return;

        await super.renderPopup();

        // Additional logic specific to IRNMNBookingModal
        this.attachContinueButtonListener();
    }

    /**
     * Attaches event listeners to the continue button within the modal.
     * This allows the button to trigger form submission when clicked or activated via keyboard.
     */
    attachContinueButtonListener() {
        const modal = this.querySelector('.irnmn-modal');
        if (!modal) return;

        const wpButtons = modal.querySelectorAll('.wp-block-button a');
        const continueButton = wpButtons[wpButtons.length - 1] || null;

        if (continueButton) {
            continueButton.setAttribute('role', 'button');
            continueButton.setAttribute('tabindex', '0');

            const handleButtonAction = (e) => {
                if (
                    e.type === 'click' ||
                    (e.type === 'keydown' && e.key === 'Enter')
                ) {
                    e.preventDefault();
                    requestAnimationFrame(() => this.form.submit());
                }
            };

            continueButton.addEventListener('click', handleButtonAction);
            continueButton.addEventListener('keydown', handleButtonAction);
        }
    }

    /**
     * Handles the form submission, preventing the default action and displaying the modal if conditions are met.
     * @param {Event} e - The form submission event.
     */
    handleBookingModal(e) {
        if (
            !this.hasModal ||
            (this.formNeedValidation &&
                this.form.getAttribute('valid') === null)
        )
            return; // Respect the 'has-modal' attribute and validate form if necessary

        e.preventDefault();
        const modal = this.querySelector('.irnmn-modal');
        if (modal) this.showModal(modal);

        if (this.timer) this.startTimer();
    }

    /**
     * Starts a countdown timer which triggers form submission upon completion.
     */
    startTimer() {
        const timerElement = this.querySelector('.modal-timer');

        let timeLeft = this.timer;
        this.timerInterval = setInterval(() => {
            timeLeft -= 1;
            if (timerElement) timerElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                this.stopTimer();
                this.form.submit();
            }
        }, 1000);
    }

    /**
     * Stops the countdown timer and clears the interval reference.
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    closeModal() {
        super.closeModal();
        this.stopTimer();
    }
}

customElements.define('irnmn-booking-modal', IRNMNBookingModal);
