class IrnmnSelect extends HTMLElement {
    constructor() {
        super();
        this.selectedOption = null;
        this.isOpen = false;
    }

    connectedCallback() {
        this.setPreselectedOption();  // Set preselected option based on value
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
        return this.getAttribute('preselected');  // Get the value of the preselected attribute
    }

    setPreselectedOption() {
        if (this.preselected) {
            // Find the index of the option that matches the preselected value
            const preselectedIndex = this.options.findIndex(
                (option) => option.value === this.preselected
            );

            if (preselectedIndex !== -1) {
                this.selectedOption = preselectedIndex;
            }
        }
    }

    render() {
        this.innerHTML = `
            <style>
                .irnmn-select {
                    position: relative;
                }
                .irnmn-select__header {
                    padding: 15px;
                    font-size: 1rem;
                    color: #000;
                    background-color: #f8f8f8;
                    border: 1px solid #000;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }
                .irnmn-select__header:hover,
                .irnmn-select__header:focus {
                    background-color: #e6e6e6;
                }
                .irnmn-select__header::after {
                    content: '▼';
                    font-size: 0.8em;
                }
                .irnmn-select__item {
                    padding: 15px;
                    border-bottom: 1px solid #e0e0e0;
                    cursor: pointer;
                }
                .irnmn-select__item:hover,
                .irnmn-select__item:focus {
                    background-color: #D3F5FF;
                }
                .irnmn-select__item:last-child {
                    border-bottom: none;
                }
                .irnmn-select__item--selected {
                    background-color: #e6f3ff;
                }
                .irnmn-select__item--unselectable {
                    color: #999;
                    pointer-events: none;
                    cursor: default;
                }
                .irnmn-select__item[aria-selected="true"] {
                    font-weight: bold;
                }
                .irnmn-select__list {
                    position: absolute;
                    display: none;
                    width: 100%;
                    padding: 0;
                    margin: 0;
                    list-style-type: none;
                    background-color: #fff;
                    overflow: hidden;
                    z-index: 1;
                }
                .irnmn-select__list--open {
                    display: block;
                    max-height: 400px;
                    overflow: auto;
                    top: 100%;
                    bottom: auto;
                }
                .irnmn-select__list--open.open-upwards {
                    top: auto;
                    bottom: 100%;
                }
                .irnmn-select__item {
                    border: 0;
                    padding: 12px 24px;
                }
            </style>
            <div class="irnmn-select" role="combobox" aria-expanded="${this.isOpen}" aria-haspopup="listbox" aria-labelledby="irnmn-select-header">
                <div id="irnmn-select-header" class="irnmn-select__header" tabindex="0">
                    ${this.selectedOption !== null ? this.options[this.selectedOption].name : this.headingText}
                </div>
                <ul id="option-list" class="irnmn-select__list ${this.isOpen ? 'irnmn-select__list--open' : ''}" role="listbox" aria-labelledby="irnmn-select-header">
                    ${this.placeholder ? `
                        <li class="irnmn-select__item irnmn-select__item--unselectable" role="option" aria-selected="false" tabindex="-1" disabled>
                            ${this.placeholder}
                        </li>` : ''}
                    ${this.options
                        .map(
                            (option, index) => `
                        <li class="irnmn-select__item" 
                            role="option" 
                            id="option-${index}" 
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
        // If the newly focused element (relatedTarget) is not within the custom select, close the list
        if (!this.contains(event.relatedTarget)) {
            this.closeList();
        }
    };

    handleClick = (event) => {
        const header = event.target.closest('.irnmn-select__header');
        const item = event.target.closest('.irnmn-select__item');
    
        if (header) {
            this.toggleList();
            return;
        }
    
        if (item && !item.classList.contains('irnmn-select__item--unselectable')) {
            this.selectOption(parseInt(item.dataset.index, 10));
            this.closeList();
            return;
        }
    
        if (!event.target.closest('.irnmn-select')) {
            this.closeList();
        }
    };

    handleKeydown = (event) => {
        const header = event.target.closest('.irnmn-select__header');
        const item = event.target.closest('.irnmn-select__item');
    
        if (header && (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === ' ')) {
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
                    (currentIndex - 1 + this.options.length) % this.options.length;
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
    
        const list = this.querySelector('.irnmn-select__list');
        const select = this.querySelector('.irnmn-select');
        const header = this.querySelector('.irnmn-select__header');
    
        if (this.isOpen) {
            this.determineDropdownPosition();
            this.focusItem(this.selectedOption !== null ? this.selectedOption : 0);
        } else {
            list.classList.remove('open-upwards');
        }
    
        list.classList.toggle('irnmn-select__list--open', this.isOpen);
        select.setAttribute('aria-expanded', this.isOpen);
    
        if (this.isOpen) {
            this.focusItem(this.selectedOption !== null ? this.selectedOption : 0);
        } else {
            header.focus();
        }
    }    

    closeList() {
        this.isOpen = false;
        const list = this.querySelector('.irnmn-select__list');
        list.classList.remove('irnmn-select__list--open');
        this.querySelector('.irnmn-select').setAttribute(
            'aria-expanded',
            'false',
        );
    }

    determineDropdownPosition() {
        const rect = this.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
    
        const list = this.querySelector('.irnmn-select__list');
    
        // Temporarily show the dropdown to calculate its height - Need to find a cleaner way!!
        list.style.display = 'block';  // Make it visible to measure height
        const dropdownHeight = list.offsetHeight;
        list.style.display = '';  // Reset the display to its original value
    
        // Only add 'open-upwards' if there is not enough space below but there is enough space above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
            list.classList.add('open-upwards');
        } else {
            list.classList.remove('open-upwards');
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
        const item = this.querySelector(`#option-${index}`);
        if (item) {
            item.focus();
        }
    }
}

customElements.define('irnmn-select', IrnmnSelect);