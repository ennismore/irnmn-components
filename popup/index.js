/**
 * General-purpose Popup Component
 * This component provides accessible modals with support for API-based content loading.
 * Includes accessibility features such as keyboard navigation, focus trapping, and optional one-time display per session.
 * @class IRNMNPopup
 * @extends {HTMLElement}
 */
class IRNMNPopup extends HTMLElement {
    /**
     * Constructor for IRNMNPopup
     * Initializes properties required for managing the modal state and accessibility.
     */
    constructor() {
        super();
        this.lastFocusedElement = null; // Keeps track of the last focused element before modal is opened, for focus restoration
        this.content = null; // Stores the content fetched from API
        this.styles = null; // Stores styles dynamically fetched from the API
    }

    /**
     * Getter for the session key.
     * @returns {string|null} - The session key for "show once per session" functionality.
     */
    get sessionKey() {
        return this.getAttribute('session-key') || null;
    }

    /**
     * Getter for the init-show attribute.
     * @returns {boolean} - Whether the modal should be initially displayed.
     */
    get initShow() {
        return this.hasAttribute('init-show') && this.getAttribute('init-show') === 'true';
    }

    /**
     * Retrieves the label for the close button from the component's attributes.
     * @returns {string} - The label text for the close button, defaulting to "Close".
     */
    get closeLabel() {
        return this.getAttribute('modal-close') || 'Close';
    }

    /**
     * Getter for the modal endpoint attribute.
     * @returns {string} - The API endpoint for fetching modal content.
     */
    get modalEndpoint() {
        return this.getAttribute('modal-endpoint');
    }

    /**
     * Called when the element is added to the DOM.
     * Fetches content, renders the modal, and attaches event listeners.
     */
    async connectedCallback() {
        if (!this.modalEndpoint) {
            console.warn('Modal endpoint is not set. Please provide a valid endpoint.');
            return;
        }

        await this.renderPopup();
    }

    static get observedAttributes() {
        return ['modal-endpoint'];
    }

    /**
     * Called when observed attributes change.
     * Re-renders the modal if the relevant attributes are modified.
     * @param {string} name - The name of the changed attribute.
     * @param {string} oldValue - The previous value of the attribute.
     * @param {string} newValue - The new value of the attribute.
     */
    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            await this.renderPopup();
        }
    }

    /**
     * Renders the booking modal and sets up its attributes and event listeners.
     */
    async renderPopup() {
        // Prevents rendering if the modal should only be shown once per session
        if (this.sessionKey && sessionStorage.getItem(this.sessionKey)) return;

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

        // Automatically show the modal if init-show is true
        if (this.initShow) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.showModal());
            } else {
                await this.showModal();
            }
        }
    }

    /**
     * Fetches content from the specified API endpoint.
     * @returns {string} - Rendered HTML content fetched from the API
     */
    async getContent() {
        try {
            const response = await fetch(this.modalEndpoint);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            this.styles = data.blockAssets?.styles || [];

            return data.content?.rendered || '';
        } catch (error) {
            console.error('Error fetching modal content:', error);
            return '';
        }
    }

    /**
     * Renders the HTML structure of the modal and injects the fetched content.
     */
    render() {
        this.innerHTML = `
            <dialog class="irnmn-modal" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">
                <div class="irnmn-modal__container">
                    <button class="irnmn-modal__close" aria-label="${this.closeLabel}">${this.closeLabel}</button>
                    ${this.content}
                </div>
            </dialog>
        `;
    }

    /**
     * Loads stylesheets dynamically from URLs provided by the API.
     */
    async loadAssets() {
        if (this.styles && this.styles.length) {
            this.styles.forEach((href) => {
                if (!document.querySelector(`link[href="${href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = href;
                    document.head.appendChild(link);
                }
            });
        }
    }

    /**
     * Attaches event listeners for closing the modal and handling keyboard interactions.
     */
    attachEventListeners() {
        const modal = this.querySelector('.irnmn-modal');
        const closeButton = this.querySelector('.irnmn-modal__close');

        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        }

        // Add focus trapping and Escape key handling
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeModal();
            } else if (e.key === 'Tab') {
                this.trapFocus(e, modal);
            }
        });

        // Close modal on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Close modal on any element with data-close attribute
        // Commonly used for buttons or links
        // that should close any modal when clicked
        this.querySelectorAll('[data-close]').forEach(el => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
            });
        });
    }

    /**
     * Displays the modal and sets accessibility attributes.
     * Ensures that the content is fully loaded before showing the modal.
     */
    async showModal() {
        const modal = this.querySelector('.irnmn-modal');
        if (!modal) return;

        this.lastFocusedElement = document.activeElement;
        modal.showModal();
        modal.classList.add('irnmn-modal--visible');
        modal.setAttribute('aria-hidden', 'false');
        modal.focus();

        // Dispatch the `irnmn-modal-opened` event
        this.dispatchEvent(
            new CustomEvent('irnmn-modal-opened', {
                detail: { element: this },
            }),
        );
    }

    /**
     * Closes the modal, restores focus, and ensures accessibility compliance.
     * @param {HTMLElement} modal - The modal element to close.
     */
    closeModal() {
        const modal = this.querySelector('.irnmn-modal');
        if (!modal) return;
        modal.close();
        modal.classList.remove('irnmn-modal--visible');
        modal.setAttribute('aria-hidden', 'true');

        if (this.sessionKey) {
            // Store the session key in sessionStorage to prevent showing the modal again
            sessionStorage.setItem(this.sessionKey, 'shown');
        }

        // Restore focus to the last focused element before the modal was opened
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }

        // Dispatch the `irnmn-modal-closed` event
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
        if (focusableElements.length === 0) return; // No focusable elements in the modal

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
     * Exposes the open methods for external use.
     * This is useful for opening the modal from outside the component.
     */
    open() {
        return this.showModal();
    }
    /**
     * Exposes the close methods for external use.
     * This is useful for closing the modal from outside the component.
     */
    close() {
        return this.closeModal();
    }
}

customElements.define('irnmn-modal', IRNMNPopup);
export { IRNMNPopup };
