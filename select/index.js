import { CLASS_NAMES } from './utils/constants.js';

class IrnmnSelect extends HTMLElement {
    constructor() {
        super();
        this.selectedOption = null;
        this.isOpen = false;
    }

    connectedCallback() {
        this.setPreselectedOption();
        this.render();
        this.setupEventListeners();
    }

    get headingText() {
        return this.getAttribute('heading-text') || 'Select an Option';
    }

    get placeholder() {
        return this.getAttribute('placeholder') || null;
    }

    get options() {
        const optionsAttr = this.getAttribute('options');
        return optionsAttr ? JSON.parse(optionsAttr) : [];
    }

    get preselected() {
        return this.getAttribute('preselected');
    }

    setPreselectedOption() {
        if (this.preselected) {
            const preselectedIndex = this.options.findIndex(
                (option) => option.value === this.preselected,
            );

            if (preselectedIndex !== -1) {
                this.selectedOption = preselectedIndex;
            }
        }
    }

    render() {
        this.innerHTML = `
            <div class="${CLASS_NAMES.select} ${this.selectedOption === null ? CLASS_NAMES.unselected : ''}" role="combobox" aria-expanded="${this.isOpen}" aria-haspopup="listbox" aria-labelledby="irnmn-select-header">
                <div id="irnmn-select-header" class="${CLASS_NAMES.header}" tabindex="0">
                    ${this.selectedOption !== null ? this.options[this.selectedOption].name : this.headingText}
                </div>
                <ul id="option-list" class="${CLASS_NAMES.list} ${this.isOpen ? CLASS_NAMES.listOpen : ''}" role="listbox" aria-labelledby="irnmn-select-header">
                    ${
                        this.placeholder
                            ? `
                        <li class="${CLASS_NAMES.item} ${CLASS_NAMES.itemUnselectable}" role="option" aria-selected="false" tabindex="-1" disabled>
                            ${this.placeholder}
                        </li>`
                            : ''
                    }
                    ${this.options
                        .map(
                            (option, index) => `
                        <li class="${CLASS_NAMES.item}" 
                            role="option" 
                            tabindex="-1"
                            aria-selected="${this.selectedOption === index ? 'true' : 'false'}"
                            data-index="${index}"
                            data-value="${option.value}">
                            ${option.name}
                        </li>
                    `,
                        )
                        .join('')}
                </ul>
            </div>
        `;
    }

    setupEventListeners() {
        this.addEventListener('click', this.handleClick);
        this.addEventListener('keydown', this.handleKeydown);
        this.addEventListener('focusout', this.handleFocusOut);
    }

    removeEventListeners() {
        this.removeEventListener('click', this.handleClick);
        this.removeEventListener('keydown', this.handleKeydown);
        this.removeEventListener('focusout', this.handleFocusOut);
    }

    handleFocusOut = (event) => {
        if (!this.contains(event.relatedTarget)) {
            this.closeList();
        }
    };

    handleClick = (event) => {
        const header = event.target.closest(`.${CLASS_NAMES.header}`);
        const item = event.target.closest(`.${CLASS_NAMES.item}`);

        if (header) {
            this.toggleList();
            return;
        }

        if (item && !item.classList.contains(CLASS_NAMES.itemUnselectable)) {
            this.selectOption(parseInt(item.dataset.index, 10));
            this.closeList();
            return;
        }

        if (!event.target.closest(`.${CLASS_NAMES.select}`)) {
            this.closeList();
        }
    };

    handleKeydown = (event) => {
        const header = event.target.closest(`.${CLASS_NAMES.header}`);
        const item = event.target.closest(`.${CLASS_NAMES.item}`);

        if (
            header &&
            (event.key === 'ArrowDown' ||
                event.key === 'ArrowUp' ||
                event.key === ' ')
        ) {
            event.preventDefault();
            this.toggleList();
            return;
        }

        if (!item) return;

        const currentIndex = parseInt(item.dataset.index, 10);
        let newIndex;

        switch (event.key) {
            case 'ArrowDown':
                newIndex = (currentIndex + 1) % this.options.length;
                break;
            case 'ArrowUp':
                newIndex =
                    (currentIndex - 1 + this.options.length) %
                    this.options.length;
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = this.options.length - 1;
                break;
            case 'Enter':
            case ' ':
                this.selectOption(currentIndex);
                this.closeList();
                return;
            case 'Escape':
                this.closeList();
                return;
            default:
                return;
        }

        event.preventDefault();
        this.focusItem(newIndex);
    };

    toggleList() {
        this.isOpen = !this.isOpen;

        const list = this.querySelector(`.${CLASS_NAMES.list}`);
        const select = this.querySelector(`.${CLASS_NAMES.select}`);
        const header = this.querySelector(`.${CLASS_NAMES.header}`);

        if (this.isOpen) {
            this.determineDropdownPosition();
            this.focusItem(
                this.selectedOption !== null ? this.selectedOption : 0,
            );
        } else {
            list.classList.remove(CLASS_NAMES.openUpwards);
        }

        list.classList.toggle(CLASS_NAMES.listOpen, this.isOpen);
        select.setAttribute('aria-expanded', this.isOpen);

        if (this.isOpen) {
            this.focusItem(
                this.selectedOption !== null ? this.selectedOption : 0,
            );
        } else {
            header.focus();
        }
    }

    closeList() {
        this.isOpen = false;
        const list = this.querySelector(`.${CLASS_NAMES.list}`);
        list.classList.remove(CLASS_NAMES.listOpen);
        this.querySelector(`.${CLASS_NAMES.select}`).setAttribute(
            'aria-expanded',
            'false',
        );
    }

    determineDropdownPosition() {
        const rect = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        const list = this.querySelector(`.${CLASS_NAMES.list}`);

        // Temporarily show the dropdown to calculate its height - Need to find a cleaner way!!
        list.style.display = 'block'; // Make it visible to measure height
        const dropdownHeight = list.offsetHeight;
        list.style.display = ''; // Reset the display to its original value

        // Only add 'open-upwards' if there is not enough space below but there is enough space above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            list.classList.add(CLASS_NAMES.openUpwards);
        } else {
            list.classList.remove(CLASS_NAMES.openUpwards);
        }
    }

    selectOption(index) {
        this.selectedOption = index;
        this.render();
        const selectedOption = this.options[index];
        this.dispatchEvent(
            new CustomEvent('optionSelected', {
                detail: {
                    option: selectedOption.name,
                    value: selectedOption.value,
                    index: index,
                },
                bubbles: true,
            }),
        );
    }

    focusItem(index) {
        const item = this.querySelector(`[data-index="${index}"]`);
        if (item) {
            item.focus();
        }
    }
}

customElements.define('irnmn-select', IrnmnSelect);
