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
        if (this.form) {
            this.form.removeEventListener('submit', this.handleBookingModal.bind(this));
        }
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

        // Load assets after the HTML is injected into the DOM
        await this.loadAssets();

        // Dispatch a custom event after rendering the modal
        this.dispatchEvent(
            new CustomEvent('irnmn-modal-loaded', {
                detail: { element: this },
            }),
        );
    }

    static get observedAttributes() {
        return ['has-modal', 'modal-endpoint', 'modal-close', 'modal-timer'];
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
     * Retrieves the content for the booking modal from the post endpoint.
     * @returns {string} The content for the modal.
     */
    async getContent() {
        if (!this.postEndpoint) return '';

        const data = await this.fetchPostData(this.postEndpoint);

        const html = data.content?.rendered || '';
        this.styles = data.blockAssets?.styles || [];
        this.scripts = data.blockAssets?.scripts || [];

        return html;
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
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
     * Loads styles and scripts assets after the HTML is injected into the DOM.
     */
    async loadAssets() {
        // Load styles assets
        if (this.styles && this.styles.length) {
            this.styles.forEach((href) => {
                if (!document.querySelector(`link[href="${href}"]`)) { // Check if the stylesheet is already loaded
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });
        }

        // Load scripts assets (always load scripts even if they are already loaded)
        if (this.scripts && this.scripts.length) {
            for (const src of this.scripts) {
                await new Promise((resolve) => {
                    this.injectWithFakeDomContentLoaded(src);
                    resolve();
                });
            }
        }
    }

    /**
     * Injects a script into the DOM with a fake DOMContentLoaded event.
     * @param {string} src - The source URL of the script to inject.
     * @default []
     */
    async injectWithFakeDomContentLoaded(src) {
        const blob = new Blob([`
            (function() {
                const originalAddEventListener = document.addEventListener;
                document.addEventListener = function(type, callback, options) {
                    if (type === 'DOMContentLoaded') {
                        callback(); // manually trigger it immediately
                    } else {
                        originalAddEventListener.call(document, type, callback, options);
                    }
                };
            })();
            var s = document.createElement('script');
            s.src = '${src}';
            document.body.appendChild(s);
        `], { type: 'application/javascript' });

        const wrapperScript = document.createElement('script');
        wrapperScript.src = URL.createObjectURL(blob);
        document.body.appendChild(wrapperScript);
    }

    /**
     * Attaches event listeners to the booking modal, such as the close button.
     */
    attachEventListeners() {
        const modal = this.querySelector('.irnmn-booking-modal');
        if (!modal) return;

        // Add event listener to the continue button
        const wpButtons = modal.querySelectorAll('.wp-block-button a'); // Get all WP buttons
        const button = wpButtons[wpButtons.length - 1] || null; // Use the last WP button as continue if it exists
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
                    requestAnimationFrame(() => this.form.submit());
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

        const timerValue = modal.querySelector('.modal-timer');

        let timeLeft = this.timer;

        this.timerInterval = setInterval(() => {
            timeLeft -= 1;
            if (timerValue) {
                timerValue.textContent = timeLeft;
            }

            if (timeLeft <= 0) {
                this.stopTimer();
                requestAnimationFrame(() => this.form.submit());
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

        const timerValue = modal.querySelector('.modal-timer');
        if (timerValue) {
            timerValue.textContent = this.timer;
        }
    }
}

customElements.define('irnmn-booking-modal', IRNMNBookingModal);
