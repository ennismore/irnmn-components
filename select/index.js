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

    get labelId() {
        return this.getAttribute('label-id') || null;
    }

    get options() {
        const optionsAttr = this.getAttribute('options');
        return optionsAttr ? JSON.parse(optionsAttr) : [];
    }

    get preselected() {
        return this.getAttribute('preselected');
    }

    get anchorLinks() {
        const value = this.getAttribute('anchor-links');
        return value === 'true' || value === true ? true : false;
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
            <div class="${CLASS_NAMES.select} ${this.selectedOption === null ? CLASS_NAMES.unselected : ''}" >
                <div class="${CLASS_NAMES.header} ${this.selectedOption !== null ? CLASS_NAMES.header + '--selected' : ''}" tabindex="0" role="combobox" aria-expanded="${this.isOpen}" aria-haspopup="listbox" ${this.labelId ? `aria-labelledby="${this.labelId}"` : ''}>
                    ${this.selectedOption !== null ? this.options[this.selectedOption].name : this.headingText}
                </div>
                <ul class="${CLASS_NAMES.list} ${this.isOpen ? CLASS_NAMES.listOpen : ''}" role="listbox">
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
                        <li class="${CLASS_NAMES.item} ${CLASS_NAMES.itemSelectable}"
                            ${this.anchorLinks ? '' : 'role="option"'}
                            tabindex="-1"
                            aria-selected="${this.selectedOption === index ? 'true' : 'false'}"
                            data-index="${index}"
                            data-value="${option.value}"
                        >
                        ${this.anchorLinks ? `<a href="${option.value}">` : ''}
                            ${option.name}
                        ${this.anchorLinks ? '</a>' : ''}
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
                event.key === ' ' ||
                event.key === 'Enter')
        ) {
            event.preventDefault();
            this.toggleList();
            return;
        }

        if (!item) return;

        // if anchor links are enabled, do not prevent default behavior for keyboard navigation
        if (item && this.anchorLinks) {
            return;
        }

        const currentIndex = parseInt(item.dataset.index, 10);
        let newIndex;

        switch (event.key) {
            case 'ArrowDown':
                newIndex = this.findNextVisibleOptionIndex(currentIndex);
                break;
            case 'ArrowUp':
                newIndex = this.findPreviousVisibleOptionIndex(currentIndex);
                break;
            case 'Home':
                newIndex = this.findFirstVisibleOptionIndex();
                break;
            case 'End':
                newIndex = this.findLastVisibleOptionIndex();
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
        const header = this.querySelector(`.${CLASS_NAMES.header}`);

        list.classList.toggle(CLASS_NAMES.listOpen, this.isOpen);
        header.setAttribute('aria-expanded', this.isOpen);

        if (this.isOpen) {
            this.determineDropdownPosition();

            const firstVisibleOptionIndex = this.findFirstVisibleOptionIndex();

            this.focusItem(
                this.selectedOption !== null
                    ? this.selectedOption
                    : firstVisibleOptionIndex,
            );
        } else {
            list.classList.remove(CLASS_NAMES.openUpwards);
            header.focus();
        }
    }

    getSelectableOptions() {
        // Retrieve and return all selectable options
        return Array.from(
            this.querySelectorAll(`.${CLASS_NAMES.itemSelectable}`),
        );
    }

    findVisibleOptionIndex(startIndex, direction) {
        const options = this.getSelectableOptions();
        const totalOptions = options.length;

        // Loop through options, wrapping around using modular arithmetic
        for (let i = 0; i < totalOptions; i++) {
            const index =
                (startIndex + i * direction + totalOptions) % totalOptions;
            // Return index of the first visible option
            if (getComputedStyle(options[index]).display !== 'none') {
                return index;
            }
        }
        // Return startIndex if no visible options found
        return startIndex;
    }

    findNextVisibleOptionIndex(currentIndex) {
        // Find the next visible option starting from the current index
        return this.findVisibleOptionIndex(currentIndex + 1, 1);
    }

    findPreviousVisibleOptionIndex(currentIndex) {
        // Find the previous visible option starting from the current index
        return this.findVisibleOptionIndex(currentIndex - 1, -1);
    }

    findFirstVisibleOptionIndex() {
        // Find the first visible option, starting from the beginning
        return this.findVisibleOptionIndex(0, 1);
    }

    findLastVisibleOptionIndex() {
        const options = this.getSelectableOptions();
        // Find the last visible option, starting from the end
        return this.findVisibleOptionIndex(options.length - 1, -1);
    }

    closeList() {
        this.isOpen = false;
        const list = this.querySelector(`.${CLASS_NAMES.list}`);
        list.classList.remove(CLASS_NAMES.listOpen);
        this.querySelector(`.${CLASS_NAMES.header}`).setAttribute(
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
