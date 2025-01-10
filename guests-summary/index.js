import { getFromSessionStorage, handleSyncEvent } from '../utils/components.js';

/**
 * IRNMNGuestsSummary is a component that displays a summary of rooms, adults, and children.
 * It dynamically updates based on 'irnmn-rooms' data in session storage, showing only
 * the values that are present (e.g., rooms and adults but no children).
 */
class IRNMNGuestsSummary extends HTMLElement {
    constructor() {
        super();
        this.summary = { rooms: 0, adults: 0, children: 0 };
    }

    /**
     * Returns the storage key used to retrieve the data from session storage.
     */
    get storageKey() {
        return this.getAttribute('storage-key');
    }

    /**
     * Returns a boolean indicating whether to display the total number of guests.
     * If true, the summary will show the total number of adults and children.
     * If false, the summary will only show the number of rooms, adults, and children if they are greater than zero.
     *
     */
    get sumGuests() {
        return this.getAttribute('sum-guests') === 'true';
    }

    /**
     *
     * Parses the labels attribute as JSON and returns an object with default values as fallbacks.
     * @returns {Object} The labels object for rooms, adults, and children.
     */
    get labels() {
        const defaultLabels = {
            room: 'room',
            rooms: 'rooms',
            adult: 'adult',
            adults: 'adults',
            child: 'child',
            children: 'children',
        };

        try {
            const labelsAttr = this.getAttribute('labels');
            return labelsAttr
                ? { ...defaultLabels, ...JSON.parse(labelsAttr) }
                : defaultLabels;
        } catch (error) {
            console.error('Invalid JSON for labels attribute:', error);
            return defaultLabels;
        }
    }

    /**
     * Lifecycle method called when the component is added to the DOM.
     * Initializes the summary display based on session storage and sets up event listeners.
     */
    connectedCallback() {
        this.loadInitialState();
        this.render();
        document.addEventListener(
            `${this.storageKey}-updated`,
            this.updateSummary.bind(this),
        );
    }

    /**
     * Lifecycle method called when the component is removed from the DOM.
     * Cleans up the event listener to avoid memory leaks.
     */
    disconnectedCallback() {
        document.removeEventListener(
            `${this.storageKey}-updated`,
            this.updateSummary.bind(this),
        );
    }

    /**
     * Loads the initial data from session storage, if available, and updates the summary state.
     */
    loadInitialState() {
        const storedData = getFromSessionStorage(this.storageKey);
        if (storedData) this.updateSummaryData(JSON.parse(storedData));
    }

    /**
     * Event handler for the `${this.storageKey}-updated` event.
     * Updates the summary data and re-renders if there are changes to the 'irnmn-rooms' data.
     *
     * @param {Event} event - The custom event containing the updated rooms data.
     */
    updateSummary(event) {
        handleSyncEvent(event, this.summary, (newState) => {
            this.updateSummaryData(newState);
            this.render();
        });
    }

    /**
     * Updates the summary data based on the provided room data.
     * Calculates the total rooms, adults, and children from the room array.
     *
     * @param {Array} data - The array of room data objects, each containing 'adults' and 'children' counts.
     */
    updateSummaryData(data) {
        this.summary = {
            rooms: data.length,
            adults: data.reduce((total, room) => total + room.adults, 0),
            children: data.reduce((total, room) => total + room.children, 0),
        };
    }

    /**
     * Renders the component's HTML based on the current summary data.
     * Only includes rooms, adults, or children if their respective counts are greater than zero.
     */
    render() {
        const { rooms, adults, children } = this.summary;
        const {
            room: roomLabel,
            rooms: roomsLabel,
            adult: adultLabel,
            adults: adultsLabel,
            child: childLabel,
            children: childrenLabel,
        } = this.labels;
        let summaryText = '';

        summaryText += this.appendSummary(
            summaryText,
            rooms,
            roomLabel,
            roomsLabel,
        );

        if (this.sumGuests) {
            summaryText += this.appendSummary(
                summaryText,
                adults + children,
                adultLabel,
                adultsLabel,
            );
        } else {
            summaryText += this.appendSummary(
                summaryText,
                adults,
                adultLabel,
                adultsLabel,
            );
            summaryText += this.appendSummary(
                summaryText,
                children,
                childLabel,
                childrenLabel,
            );
        }

        this.innerHTML = `<p>${summaryText}</p>`;
    }

    appendSummary(summaryText, count, singularLabel, pluralLabel) {
        if (count > 0) {
            return `${summaryText ? ', ' : ''}${count} ${count > 1 ? pluralLabel : singularLabel}`;
        }
        return '';
    }
}

// Define the custom element
customElements.define('irnmn-guests-summary', IRNMNGuestsSummary);
