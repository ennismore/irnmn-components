import { CLASS_NAMES } from './utils/constants.js';

class IrnmnSelect extends HTMLElement {
    constructor() {
        super();
        this.selectedOption = null;
        this.isOpen = false;
        this.renderingNativeSelect = false;
    }

    connectedCallback() {
        this.setPreselectedOption();
        this.render();
        this.listenToWindowResize();
        this.setupEventListeners();

        this.renderNativeSelect
            ? this.showNativeSelect()
            : this.hideNativeSelect();
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

    isRenderingNativeSelect() {
        return this.nativeSelectElement ? true : false;
    }

    /**
     * Gets whether to use native select or not.
     *
     * @return {boolean} Defaults to false.
     */
    get useNativeSelect() {
        return this.getAttribute('use-native-select') === 'true';
    }

    /**
     * Gets the breakpoint at which we display the native select
     *
     * @return {int} Returns the breakpoint in pixels
     */
    get nativeSelectBreakpoint() {
        return parseInt(this.getAttribute('native-select-breakpoint')) || 768;
    }

    /**
     * Gets if we should render the native select
     *
     * @return {boolean} Returns the breakpoint in pixels
     */
    get renderNativeSelect() {
        return (
            this.useNativeSelect &&
            this.nativeSelectBreakpoint >= window.innerWidth
        );
    }

    setNativeOption(newOption) {
        const nativeSelect = this.nativeSelectElement;
        if (!nativeSelect) return;
        this.selectedNativeOption = newOption;

        nativeSelect.value = this.selectedNativeOption;
        // Updating the value on the HTML element so it's in sync
        nativeSelect.setAttribute('value', this.selectedNativeOption);
    }

    /**
     * Prefills the Native Select element with the correct value
     */
    setNativePreselectOption() {
        const nativeSelect = this.nativeSelectElement;
        if (!nativeSelect) return;

        // Get the hidden input value or default value
        const preselectedValue = this.preselected || this.selectedOption || '';

        if (preselectedValue) nativeSelect.value = preselectedValue;
    }

    /**
     *  Gets the Native Select element if it's there
     *
     * @returns {HTMLElement}
     */
    get nativeSelectElement() {
        const nativeSelect = this.querySelector('select');
        return nativeSelect;
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
            <div class="${CLASS_NAMES.select} ${this.selectedOption === null ? CLASS_NAMES.unselected : ''} ${this.useNativeSelect ? 'using-native-select' : ''}" >
                ${`
                    ${this.useNativeSelect
                ? `
                            <select value="${this.selectedNativeOption}">
                                <option ${!this.selectedOption ? 'selected' : ''} disabled>${this.placeholder}</option>
                                ${this.options
                    .map(
                        (option, index) =>
                            `<option ${this.selectedOption === index ? 'selected' : ''} value="${option.value}">${option.name}</option>`,
                    )
                    .join('')}
                            </select>
                            `
                : ``
            }
                    <div class="${CLASS_NAMES.header} ${this.selectedOption !== null ? CLASS_NAMES.header + '--selected' : ''}" tabindex="0" role="combobox" aria-expanded="${this.isOpen}" aria-haspopup="listbox" ${this.labelId ? `aria-labelledby="${this.labelId}"` : ''}>
                        ${this.selectedOption !== null ? this.options[this.selectedOption].name : this.headingText}
                    </div>
                    <ul class="${CLASS_NAMES.list} ${this.isOpen ? CLASS_NAMES.listOpen : ''}" role="listbox">
                    ${this.placeholder
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
                </ul>`}
            </div>
        `;
    }

    listenToWindowResize() {
        // Attaching resize event listener to the window if we plan on rendering the native select
        if (this.useNativeSelect) {
            window.addEventListener('resize', () => {
                // Making a check to see if we have reached the breakpoint and we are not yet rendering the native select
                // Need to do this so we are not running the code on every single resize event
                if (
                    this.renderNativeSelect &&
                    this.renderingNativeSelect == false
                ) {
                    this.renderingNativeSelect = true;
                    this.showNativeSelect();
                } else if (
                    !this.renderNativeSelect &&
                    this.renderingNativeSelect == true
                ) {
                    this.renderingNativeSelect = false;
                    this.hideNativeSelect();
                }
            });
        }
    }

    showNativeSelect() {
        const nativeSelect = this.nativeSelectElement;
        if (nativeSelect) {
            nativeSelect.setAttribute('aria-disabled', false);
            nativeSelect.setAttribute('aria-hidden', false);
        }

        const header = this.querySelector("[role='combobox']");
        const list = this.querySelector('ul');

        if (header && list) {
            header.setAttribute('aria-disabled', true);
            header.setAttribute('aria-hidden', true);

            list.setAttribute('aria-disabled', true);
            list.setAttribute('aria-hidden', true);
        }
    }

    hideNativeSelect() {
        const nativeSelect = this.nativeSelectElement;
        if (nativeSelect) {
            nativeSelect.setAttribute('aria-disabled', true);
            nativeSelect.setAttribute('aria-hidden', true);
        }

        const header = this.querySelector("[role='combobox']");
        const list = this.querySelector('ul');

        if (header && list) {
            header.setAttribute('aria-disabled', false);
            header.setAttribute('aria-hidden', false);

            list.setAttribute('aria-disabled', false);
            list.setAttribute('aria-hidden', false);
        }
    }

    setupEventListeners() {
        this.addEventListener('click', this.handleClick);
        this.addEventListener('keydown', this.handleKeydown);
        this.addEventListener('focusout', this.handleFocusOut);
        this.addEventListener('change', this.handleNativeChange);
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
        // If we clicked on the native select or its options we return
        if (
            event.target == this.nativeSelectElement ||
            event.target.tagName.toLowerCase() == 'option'
        )
            return;

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

    handleNativeChange = (event) => {
        // handling the click directly here for the native select
        const value = event.target.value;
        const selectedIndex = event.target.selectedIndex;
        const option = event.target.options[selectedIndex].text;

        this.dispatchEvent(
            new CustomEvent('optionSelected', {
                detail: {
                    value: value,
                    index: selectedIndex,
                    option: option,
                },
                bubbles: true,
            }),
        );

        this.selectedOption = this.options.findIndex(
            (option) => option.value === value,
        );
        this.render();
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

if (!customElements.get('irnmn-select')) {
    customElements.define('irnmn-select', IrnmnSelect);
}
