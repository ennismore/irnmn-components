class IRNMNRoomsSelector extends HTMLElement {
    constructor() {
        super();
        this.maxRooms = parseInt(this.getAttribute('max-rooms')) || 5; // Maximum number of rooms
        this.minRooms = parseInt(this.getAttribute('min-rooms')) || 1; // Minimum number of rooms
        this.label = this.getAttribute('label') || 'Rooms';
        this.roomSelectors = [];
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="rooms-selector">
                <label for="room-count">${this.label}</label>
                <select id="room-count">
                    ${this.generateRoomOptions()}
                </select>
                <div id="room-container"></div>
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
        this.querySelector('#room-count').addEventListener('change', (e) => {
            const selectedRooms = parseInt(e.target.value);
            this.updateRoomSelectors(selectedRooms);
        });
    }

    updateRoomSelectors(selectedRooms) {
        const currentRooms = this.roomSelectors.length;

        if (selectedRooms > currentRooms) {
            this.addRooms(selectedRooms - currentRooms);
        } else if (selectedRooms < currentRooms) {
            this.removeRooms(currentRooms - selectedRooms);
        }
    }

    addRooms(count) {
        const roomContainer = this.querySelector('#room-container');
        for (let i = 0; i < count; i++) {
            const roomSelector = document.createElement('irnmn-guests-selector');
            roomSelector.setAttribute('label', `Room ${this.roomSelectors.length + 1}`);
            roomSelector.setAttribute('max-total-guests', '5');
            roomSelector.setAttribute('max-adults', '3');
            roomSelector.setAttribute('max-children', '2');
            roomSelector.setAttribute('max-child-age', '17');
            roomContainer.appendChild(roomSelector);
            this.roomSelectors.push(roomSelector);
        }
    }

    removeRooms(count) {
        const roomContainer = this.querySelector('#room-container');
        for (let i = 0; i < count; i++) {
            const roomToRemove = this.roomSelectors.pop();
            roomContainer.removeChild(roomToRemove);
        }
    }
}

customElements.define('irnmn-rooms-selector', IRNMNRoomsSelector);
