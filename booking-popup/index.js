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
        this.timerInterval = null; // To store the timer interval reference
    }

    /**
     * Lifecycle method called when the element is added to the DOM.
     * Initializes the form and sets up the booking modal.
     */
    async connectedCallback() {
        if (!this.formId) return;
        this.form = document.getElementById(this.formId);

        if (!this.form) return;
        await this.renderBookingModal();
        this.form.addEventListener('submit', this.handleBookingModal.bind(this));
    }

    /**
     * Lifecycle method called when the element is removed from the DOM.
     * Cleans up event listeners.
     */
    disconnectedCallback() {
        if (!this.form) return;
        this.form.removeEventListener('submit', this.handleBookingModal.bind(this));
        this.stopTimer(); // Ensure the timer is cleared when the component is removed
    }

    /**
     * Renders the booking modal and sets up its attributes and event listeners.
     */
    async renderBookingModal() {
        if (!this.hasModal) return; // Do nothing if the modal is disabled
        this.content = await this.getContent();
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

    static get observedAttributes() {
        return [
            'has-modal',
            'modal-endpoint',
            'modal-title',
            'modal-text',
            'modal-cta',
            'modal-close',
            'modal-timer',
            'modal-image',
        ];
    }

    /**
     * Lifecycle method called when observed attributes change.
     * @param {string} name - The name of the changed attribute.
     * @param {string} oldValue - The old value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            await this.renderBookingModal();
        }
    }

    /**
     * Retrieves the form ID from the component's attributes.
     * @returns {string|null} The form ID or null if not set.
     * @default null
     */
    get formId() {
        return this.getAttribute('form-id') || null;
    }

    /**
     * Retrieves the modal-endpoint attribute from the component's attributes.
     * @returns {string|null} The value of the modal-endpoint attribute or null if not set.
     * @default null
     */
    get postEndpoint() {
        return this.getAttribute('modal-endpoint') || null;
    }

    /**
     * Retrieves the form-need-validation attribute from the component's attributes.
     * @returns {boolean} The value of the form-need-validation attribute.
     * @default true
     */
    get formNeedValidation() {
        const formNeedValidationAttr = this.getAttribute('form-need-validation');
        return (
            formNeedValidationAttr === 'true' ||
            formNeedValidationAttr === null ||
            (formNeedValidationAttr !== 'false' &&
                formNeedValidationAttr !== 'null' &&
                formNeedValidationAttr)
        );
    }

    /**
     * Retrieves the title for the booking modal.
     * @returns {string} The title for the modal.
     */
    get titleLabel() {
        return this.getAttribute('modal-title') || 'You will be redirected';
    }

    /**
     * Retrieves the text for the booking modal.
     * @returns {string} The text for the modal.
     */
    get textLabel() {
        return this.getAttribute('modal-text') || 'Click continue to proceed to the booking engine';
    }

    /**
     * Retrieves the CTA label for the booking modal.
     * @returns {string} The CTA label for the modal.
     */
    get ctaLabel() {
        return this.getAttribute('modal-cta') || 'Continue';
    }

    /**
     * Retrieves the close label for the booking modal.
     * @returns {string} The close label for the modal.
     */
    get closeLabel() {
        return this.getAttribute('modal-close') || 'Close';
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
     * Retrieves the has-modal attribute from the component's attributes.
     * @returns {boolean} The value of the has-modal attribute.
     * @default false
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
     * Retrieves the image-src attribute from the component's attributes.
     * @returns {string|null} The value of the image-src attribute or null if not set.
     */
    get imageSrc() {
        return this.getAttribute('modal-image') || null;
    }

    /**
     * Retrieves the content for the booking modal from the post endpoint.
     * If the post endpoint is not set, it generates the content from the component's attributes.
     * @returns {string} The content for the modal.
     */
    async getContent() {
        if (!this.postEndpoint) {
            const timerValue = this.timer
                ? `<div class="irnmn-booking-modal__timer"><span>${this.timer}</span>sec</div>`
                : '';
            const image = this.imageSrc && this.imageSrc !== '' && this.imageSrc !== 'null' && this.imageSrc !== 'false'
                ? `<img src="${this.imageSrc}" role="presentation" aria-hidden="true" class="irnmn-booking-modal__image">`
                : '';

            return `
                <h2 class="irnmn-booking-modal__title" id="irnmn-modal-title">${this.titleLabel}</h2>
                ${this.textLabel ? `<p class="irnmn-booking-modal__text" id="irnmn-modal-description">${this.textLabel}</p>` : ''}
                ${timerValue}
                <button class="irnmn-booking-modal__cta">${this.ctaLabel}</button>
                ${image}
            `;
        } else {
            const postData = await this.fetchPostData(this.postEndpoint);
            return postData.content.rendered || '';
        }
    }

    /**
     * Fetches the post content from the provided endpoint.
     * @param {string} postEndpoint - The endpoint to fetch the post content from.
     * @returns {Promise} The promise that resolves with the post content.
     * @default []
     */
    async fetchPostData(postEndpoint) {
        try {
            const response = await fetch(postEndpoint);
            return await response.json();
        } catch (error) {
            console.error('Error fetching post', error);
            return [];
        }
    }

    /**
     * Renders the HTML structure of the booking modal.
     */
    render() {
        this.innerHTML = `
            <dialog class="irnmn-booking-modal" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1" aria-labelledby="irnmn-modal-title" aria-describedby="irnmn-modal-description">
                <div class="irnmn-booking-modal__container">
                    <button class="irnmn-booking-modal__close" aria-label="${this.closeLabel}" aria-controls="irnmn-booking-modal" aria-expanded="false">${this.closeLabel}</button>
                    ${this.content}
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

        // Add event listener to the continue button
        const wpButtons = modal.querySelectorAll('.wp-block-button a'); // Get all WP buttons
        // Get the modal native button or the last WP button
        const button = modal.querySelector('.irnmn-booking-modal__cta') || (wpButtons.length > 0 ? wpButtons[wpButtons.length - 1] : null);
        if (button) {
            // Add necessary attributes for accessibility
            button.setAttribute('aria-controls', 'irnmn-booking-modal');
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');

            // Add event listener to the button for click and keydown events
            const handleButtonAction = (e) => {
                if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
                    e.preventDefault();
                    // Submit the form without showing the modal
                    this.form.submit();
                }
            };
            button.addEventListener('click', handleButtonAction);
            button.addEventListener('keydown', handleButtonAction);
        }

        // Add event listener to the close button
        const closeButton = modal.querySelector('.irnmn-booking-modal__close');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(modal);
            });
        }

        // Add focus trapping and Escape key handling
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeModal(modal);
            } else if (e.key === 'Tab') {
                this.trapFocus(e, modal);
            }
        });
    }

    /**
     * Handles the form submission event to display the booking modal.
     * @param {Event} e - The form submission event.
     */
    handleBookingModal(e) {
        if (!this.hasModal || (this.formNeedValidation && this.form.getAttribute('valid') === null)) return; // Do nothing if the modal is disabled or the form is invalid and needs validation

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
        modal.showModal();

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
        modal.close();

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
                this.stopTimer();
                this.closeModal(modal);
                this.form.submit();
            }
        }, 1000);
    }

    /**
     * Stops the timer for the booking modal.
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        const timer = modal.querySelector('.irnmn-booking-modal__timer span');
        if (!timer) return;
        timer.textContent = this.timer;
    }
}

customElements.define('irnmn-booking-modal', IRNMNBookingModal);
