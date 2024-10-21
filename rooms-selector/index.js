import { CLASS_NAMES } from './utils/constants.js';

class IRNMNRoomsSelector extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.setAttributes();
        this.render();
        this.attachEventListeners();
    }

    setAttributes() {
        this.maxRooms = this.getMaxRooms();
        this.minRooms = this.getMinRooms();
        this.label = this.getLabel();
        this.roomSelectors = [];
        
    }

     /**
     * Get the maximum number of rooms.
     * @return {Number} Max rooms or default value 5.
     */
     getMaxRooms() {
        return parseInt(this.getAttribute('max-rooms')) || 5;
    }

    /**
     * Get the minimum number of rooms.
     * @return {Number} Min rooms or default value 1.
     */
    getMinRooms() {
        return parseInt(this.getAttribute('min-rooms')) || 1;
    }

    /**
     * Get the label for the rooms.
     * @return {String} Label or default value 'Rooms'.
     */
    getLabel() {
        return this.getAttribute('label') || 'Rooms';
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.roomsSelector}">
                <label for="room-count">${this.label}</label>
                <select class="${CLASS_NAMES.roomCountSelect}">
                    ${this.generateRoomOptions()}
                </select>
                <div class="${CLASS_NAMES.roomContainer}"></div>
            </div>
        `;
        this.addRooms(this.minRooms); // Start with the minimum number of rooms
    }

    generateRoomOptions() {
        let options = '';
        for (let i = this.minRooms; i <= this.maxRooms; i++) {
            options += `<option value="${i}">${i}</option>`;
        }
        return options;
    }

    attachEventListeners() {
        this.querySelector(`.${CLASS_NAMES.roomCountSelect}`).addEventListener('change', (e) => {
            const selectedRooms = parseInt(e.target.value);
            this.updateRoomSelectors(selectedRooms);
        });
    }

    updateRoomSelectors(selectedRooms) {
        const currentRooms = this.roomSelectors.length;
        const newRooms = selectedRooms - currentRooms;

        if (newRooms > 0) {
            this.addRooms(newRooms);
            return;
        }
        this.removeRooms(-newRooms);
    }

    addRooms(count) {
        const roomContainer = this.querySelector(`.${CLASS_NAMES.roomContainer}`);
        let roomSelectorsHtml = '';
        
        for (let i = 0; i < count; i++) {
            roomSelectorsHtml += `
                <irnmn-guests-selector 
                    label="Room ${this.roomSelectors.length + 1}" 
                    max-total-guests="5" 
                    max-adults="3" 
                    max-children="2" 
                    max-child-age="17">
                </irnmn-guests-selector>
            `;
            this.roomSelectors.push({});
        }
    
        roomContainer.innerHTML += roomSelectorsHtml;
    }
    

    removeRooms(count) {
        const roomContainer = this.querySelector(`.${CLASS_NAMES.roomContainer}`);
        for (let i = 0; i < count; i++) {
            const roomToRemove = this.roomSelectors.pop();
            roomContainer.removeChild(roomToRemove);
        }
    }
}

customElements.define('irnmn-rooms-selector', IRNMNRoomsSelector);
