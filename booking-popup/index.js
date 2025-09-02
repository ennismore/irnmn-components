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
        this.hasContinueButton = false;
        this._onSubmit = this.handleBookingModal.bind(this);
    }

    /**
     * Retrieves the form ID from the component's attributes.
     * @returns {string|null} The form ID or null if not set.
     */
    get formId() {
        return this.getAttribute('form-id') || null;
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

        if (this.form) this.form.addEventListener('submit', this._onSubmit);
    }

    /**
     * Called when the element is removed from the DOM.
     * Ensures event listeners are properly removed.
     */
    disconnectedCallback() {
        if (this.form) this.form.removeEventListener('submit', this._onSubmit);
        super.disconnectedCallback();
    }

    static get observedAttributes() {
        // Combine parent class's observed attributes with new ones
        return [
            ...(super.observedAttributes || []),
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
        this.hasContinueButton = false;

        const modal = this.querySelector('.irnmn-modal');
        if (!modal) return;

        const wpButtons = modal.querySelectorAll('.wp-block-button a');
        const continueButton = wpButtons[wpButtons.length - 1] || false;

        if (!continueButton) return;

        this.hasContinueButton = true;

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

    /**
     * Handles the form submission, preventing the default action and displaying the modal if conditions are met.
     * @param {Event} e - The form submission event.
     */
    handleBookingModal(e) {
        const modal = this.querySelector('.irnmn-modal');

        // Check if the modal can be shown and log warnings/errors for each case
        if (!this.hasModal) {
            console.warn('[Booking Modal Warning]: has-modal attribute is not enabled.');
            return;
        }
        if (this.formNeedValidation && this.form.getAttribute('valid') === null) {
            console.warn('[Booking Modal Warning]: Form validation required and form is not valid.');
            return;
        }
        if (!modal) {
            console.error('[Booking Modal Error]: Modal element not found.');
            return;
        }
        if (this.content === null || this.content.trim() === '') {
            console.error('[Booking Modal Error]: Modal content is missing : null or empty', this.content);
            return;
        }
        if (!this.hasContinueButton) {
            console.error('[Booking Modal Error]: Continue button not found in modal.');
            return;
        }

        // If everything is valid, prevent default form submission and show the modal
        e.preventDefault();
        this.showModal(modal);
    }

    closeModal() {
        super.closeModal();
    }
}
if (!customElements.get('irnmn-booking-modal')) {
    customElements.define('irnmn-booking-modal', IRNMNBookingModal);
}
