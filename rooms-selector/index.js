import { CLASS_NAMES } from './utils/constants.js';

import {
    saveToSessionStorage,
    getFromSessionStorage,
    dispatchSyncEvent,
} from '../utils/components.js';

class IRNMNRoomsSelector extends HTMLElement {
    constructor() {
        super();

        this.state = {
            rooms: [],
        };
    }

    connectedCallback() {
        this.renderRoomsSelector();
    }

    renderRoomsSelector() {
        this.setAttributes();
        this.render();
        this.loadFromSessionStorage();
        this.attachEventListeners();

        Promise.resolve().then(() => {
            this.dispatchEvent(
                new CustomEvent('irnmn-rooms-selector-loaded', {
                    detail: { element: this },
                }),
            );
        });
    }

    setAttributes() {
        this.roomsNumber = this.getRoomsNumber();
        this.minRooms = this.getMinRooms();
        this.maxTotalGuests = this.getMaxTotalGuests();
        this.adultsNumber = this.getAdultsNumber();
        this.enableChildren = this.getEnableChildren();
        this.childrenNumber = this.getChildrenNumber();
        this.enableChildrenAges = this.getEnableChildrenAges();
        this.maxChildAge = this.getMaxChildAge();
        this.labels = this.getLabels();
    }

    static get observedAttributes() {
        return [
            'rooms-number',
            'min-rooms',
            'max-total-guests',
            'adults-number',
            'children-number',
            'max-child-age',
            'enable-children',
            'enable-children-ages',
        ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.renderRoomsSelector();
        }
    }

    /**
     * Get the maximum number of rooms.
     * @return {Number} Max rooms or default value 5.
     *
     */
    loadFromSessionStorage() {
        const rooms = getFromSessionStorage(`${this.name}`);
        if (rooms) {
            this.state.rooms = JSON.parse(rooms);
            if (this.state.rooms.length > this.roomsNumber) {
                this.state.rooms = this.state.rooms.slice(0, this.roomsNumber);
            }
            this.updateRoomCount(this.state.rooms.length);
            // update select value
            const roomCountSelect = this.querySelector(
                `.${CLASS_NAMES.roomCountSelect}`,
            );
            roomCountSelect.value = this.state.rooms.length;
            roomCountSelect.dispatchEvent(new Event('change'));
        } else {
            this.updateRoomCount(this.minRooms); // minimum rooms on init by default if nothing saved in storage
        }
        this.syncState(); // Initial sync
    }

    /**
     * Check if children are enabled.
     * @return {Boolean} True if children are enabled, false otherwise.
     * Get the name attribute of the component, that will be used in the form data.
     */
    get name() {
        return this.getAttribute('name') || 'irnmn-rooms';
    }

    getEnableChildren() {
        const enableChildrenAttr = this.getAttribute('enable-children');
        return (
            enableChildrenAttr === 'true' ||
            (enableChildrenAttr !== 'false' &&
                enableChildrenAttr !== 'null' &&
                enableChildrenAttr)
        );
    }

    /**
     * Check if child ages are enabled.
     * @return {Boolean} True if child ages are enabled, false otherwise.
     */
    getEnableChildrenAges() {
        const enableChildrenAgesAttr = this.getAttribute(
            'enable-children-ages',
        );
        return (
            enableChildrenAgesAttr === 'true' ||
            (enableChildrenAgesAttr !== 'false' &&
                enableChildrenAgesAttr !== 'null' &&
                enableChildrenAgesAttr)
        );
    }

    /**
     * Get the maximum number of rooms.
     * @return {Number} Max rooms or default value 5.
     */
    getRoomsNumber() {
        return parseInt(this.getAttribute('rooms-number')) || 5;
    }

    /**
     * Get the minimum number of rooms.
     * @return {Number} Min rooms or default value 1.
     */
    getMinRooms() {
        return parseInt(this.getAttribute('min-rooms')) || 1;
    }

    /**
     * Get the maximum total number of guests.
     * @return {Number} Max total guests or default value of 5.
     */
    getMaxTotalGuests() {
        return parseInt(this.getAttribute('max-total-guests')) || 5;
    }

    /**
     * Get the maximum number of adults.
     * @return {Number} Max adults or default value of 5.
     */
    getAdultsNumber() {
        return parseInt(this.getAttribute('adults-number')) || 5;
    }

    /**
     * Get the maximum number of children.
     * @return {Number} Max children or default value of 5.
     */
    getChildrenNumber() {
        return parseInt(this.getAttribute('children-number')) || 5;
    }

    /**
     * Get the maximum age for children.
     * @return {Number} Max child age or default value of 17.
     */
    getMaxChildAge() {
        return parseInt(this.getAttribute('max-child-age')) || 17;
    }

    /**
     * Get the label for the rooms.
     * @return {String} Label or default value 'Rooms'.
     */
    getLabels() {
        const defaultLabels = {
            room: 'Room',
            rooms: 'Rooms',
            guests: 'Guests',
            adults: 'Adults',
            children: 'Children',
            childAge: 'Child age',
            selectRoom: 'Select number of rooms',
            remove: 'Remove',
            ariaLabelMoreAdults: 'Add one adult',
            ariaLabelLessAdults: 'Remove one adult',
            ariaLabelMoreChildren: 'Add one child',
            ariaLabelLessChildren: 'Remove one child',
        };
        const customLabels = JSON.parse(this.getAttribute('labels')) || {};
        return { ...defaultLabels, ...customLabels };
    }

    /**
     * Renders the rooms selector component.
     *
     * This method sets the inner HTML of the component to include a label, a select dropdown for room count,
     * and a container for room details. It initializes the room count to one by default.
     *
     * @method render
     */
    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomsSelector}">
                <label for="room-count">${this.labels.selectRoom}</label>
                <div class="${CLASS_NAMES.roomCountSelect}-wrapper">
                    <select class="${CLASS_NAMES.roomCountSelect}" name="rooms-total">
                        ${this.generateRoomOptions()}
                    </select>
                </div>
                <div class="${CLASS_NAMES.roomContainer}"></div>
            </div>
        `;
    }

    /**
     * Generates HTML option elements for a range of room numbers.
     *
     * This method creates a string of `<option>` elements, each representing a room number
     * within the range defined by `this.minRooms` and `this.roomsNumber`.
     *
     * @returns {string} A string containing HTML `<option>` elements for each room number.
     */
    generateRoomOptions() {
        let options = '';
        for (let i = this.minRooms; i <= this.roomsNumber; i++) {
            options += `<option value="${i}">${i} ${i == 1 ? this.labels.room : this.labels.rooms}</option>`;
        }
        return options;
    }

    /**
     * Attaches on change event listeners to the room count select element.
     * When the room count changes, it updates the number of rooms displayed.
     */
    attachEventListeners() {
        this.querySelector(`.${CLASS_NAMES.roomCountSelect}`).addEventListener(
            'change',
            (e) => {
                const selectedRoomsNumber = parseInt(e.target.value);
                this.updateRoomCount(selectedRoomsNumber);
            },
        );
    }

    /**
     * Updates the number of rooms displayed based on the provided room count.
     *
     * @param {number} roomCount - The desired number of rooms to be displayed.
     *
     * This function adjusts the number of room elements in the DOM to match the specified room count.
     * If the new room count is greater than the current number of rooms, it adds the necessary number of rooms.
     * If the new room count is smaller, it removes the excess rooms.
     */
    updateRoomCount(roomCount) {
        const roomContainer = this.querySelector(
            `.${CLASS_NAMES.roomContainer}`,
        );
        const roomsList = roomContainer.querySelectorAll(
            'irnmn-guests-selector',
        );

        // If new room count is greater, add rooms
        if (roomCount > roomsList.length) {
            for (let i = roomsList.length + 1; i <= roomCount; i++) {
                this.addRoom(i, roomContainer);
            }
        }

        // If new room count is smaller, remove rooms
        if (roomCount < roomsList.length) {
            for (let i = roomsList.length; i > roomCount; i--) {
                this.removeRoom(i, roomContainer);
            }
        }

        this.syncState();
    }

    checkIfOneRoom() {
        const roomContainer = this.querySelector(
            `.${CLASS_NAMES.roomContainer}`,
        );
        const roomsList = roomContainer.querySelectorAll(
            'irnmn-guests-selector',
        );
        // add a class to the room container if only one room is listed (to hide remove button)
        roomContainer.classList.toggle('one-room', roomsList.length === 1);
    }

    /**
     * Adds a new room to the room container (at the end of the list) and updates the state.
     *
     * @param {number} roomIndex - The index of the room to be added.
     * @param {HTMLElement} roomContainer - The container element where the room will be added.
     */
    addRoom(roomIndex, roomContainer) {
        let roomState;
        //if room already exists in the state, retieve its data
        if (this.state.rooms[roomIndex - 1]) {
            roomState = this.state.rooms[roomIndex - 1];
        } else {
            roomState = false;
            //if room does not exist in the state, create a default one
            this.state.rooms.push({
                adults: 2, // Default adults
                children: 0, // Default children
                childrenAges: [], // Initialize empty array for child ages
            });
        }
        const roomGuestsHTML = `
            <irnmn-guests-selector
                init-state='${JSON.stringify(roomState)}'
                name="rooms[${roomIndex - 1}]"
                label="${this.labels.room} ${roomIndex}"
                labels='${JSON.stringify(this.labels)}'
                max-total-guests="${this.maxTotalGuests}"
                adults-number="${this.adultsNumber}"
                children-number="${this.childrenNumber}"
                max-child-age="${this.maxChildAge}"
                enable-children="${this.enableChildren}"
                enable-children-ages="${this.enableChildrenAges}"
                >
            </irnmn-guests-selector>
        `;

        // Append the new room
        roomContainer.insertAdjacentHTML('beforeEnd', roomGuestsHTML);
        const roomGuests = roomContainer.querySelectorAll(
            'irnmn-guests-selector',
        )[roomIndex - 1];

        // update session storage
        saveToSessionStorage('irnmn-rooms', JSON.stringify(this.state.rooms));
        // Add event listeners to track changes in the room's state
        this.trackRoomChanges(roomGuests);
        this.checkIfOneRoom();
        this.syncState();
    }

    /**
     * Removes a room from the DOM and updates the state.
     *
     * @param {number} roomIndex - The index of the room to be removed (1-based index).
     * @param {HTMLElement} roomContainer - The container element that holds the room elements.
     */
    removeRoom(roomIndex, roomContainer) {
        // Find the room element by room number and remove it from the DOM
        const roomElement = roomContainer.querySelectorAll(
            `irnmn-guests-selector`,
        )[roomIndex - 1];
        if (roomElement) {
            roomContainer.removeChild(roomElement);
        }

        // Remove the room from the state
        this.state.rooms.splice(roomIndex - 1, 1);
        // update session storage
        saveToSessionStorage(`${this.name}`, JSON.stringify(this.state.rooms));
        this.checkIfOneRoom();
        this.syncState();
    }

    /**
     * Updates the room listing by setting the name and label attributes
     * for each room selector within the room container.
     */
    updateRoomsListing() {
        const roomContainer = this.querySelector(
            `.${CLASS_NAMES.roomContainer}`,
        );
        const roomSelectors = roomContainer.querySelectorAll(
            'irnmn-guests-selector',
        );

        roomSelectors.forEach((roomSelector, index) => {
            roomSelector.setAttribute('name', `rooms[${index}]`);
            roomSelector.setAttribute(
                'label',
                `${this.labels.room} ${index + 1}`,
            );
        });
    }

    getRoomIndex(roomGuests) {
        const roomContainer = this.querySelector(
            `.${CLASS_NAMES.roomContainer}`,
        );
        const roomSelectors = Array.from(
            roomContainer.querySelectorAll('irnmn-guests-selector'),
        );
        return roomSelectors.indexOf(roomGuests) + 1;
    }

    /**
     * Tracks changes to room details and updates the state accordingly.
     *
     * This function listens for 'roomValuesChange' and 'roomRemoved' events from the room-guests component.
     * When 'roomValuesChange' is triggered, it updates the room object with new adults, children, and childrenAges data.
     * When 'roomRemoved' is triggered, it removes the room from the state and updates the room listing.
     *
     * @param {HTMLElement} roomGuests - The room-guests component that emits the events.
     * @param {number} roomIndex - The index of the room being tracked.
     */
    trackRoomChanges(roomGuests) {
        // Listen for the 'roomValuesChange' event from the room-guests component
        roomGuests.addEventListener('irnmn-roomValuesChange', (event) => {
            const roomIndex = this.getRoomIndex(roomGuests);
            if (roomIndex === 0) {
                return;
            } // if roomIndex is 0, it means the room don't exist
            const room = this.state.rooms[roomIndex - 1];

            // Update the room object with the new adults, children, and childrenAges data
            if ('adults' in event.detail) {
                room.adults = event.detail.adults;
            }
            if ('children' in event.detail) {
                room.children = event.detail.children;
            }
            if ('childrenAges' in event.detail) {
                room.childrenAges = event.detail.childrenAges;
            }
            // update session storage
            saveToSessionStorage(
                'irnmn-rooms',
                JSON.stringify(this.state.rooms),
            );
            saveToSessionStorage(
                `${this.name}`,
                JSON.stringify(this.state.rooms),
            );
            this.syncState();
        });
        // Listen for the 'roomRemoved' event from the room-guests component
        roomGuests.addEventListener('irnmn-roomRemoved', (event) => {
            const roomContainer = this.querySelector(
                `.${CLASS_NAMES.roomContainer}`,
            );
            const roomIndex = this.getRoomIndex(roomGuests);

            this.removeRoom(roomIndex, roomContainer);
            this.updateRoomsListing();
            // update select value
            const roomCountSelect = this.querySelector(
                `.${CLASS_NAMES.roomCountSelect}`,
            );
            roomCountSelect.value = this.state.rooms.length;
            roomCountSelect.dispatchEvent(new Event('change'));
            this.syncState();
        });
    }

    syncState() {
        dispatchSyncEvent(`${this.name}-updated`, this.state.rooms);
    }
}

customElements.define('irnmn-rooms-selector', IRNMNRoomsSelector);
