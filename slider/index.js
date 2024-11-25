class IRNMNSlider extends HTMLElement {
    CLASSNAMES = [];
    eventListeners = [];

    constructor() {
        super();
        this.CLASSNAMES = this.selectors;
        this.currentSlide = 1; // Start from the first visible slide after cloning        
    }

    /**
     * Get the selectors from the attribute
     * to be used as classnames obj
     * 
     * @returns {object} - The selectors object
     */
    get selectors() {
        let selectors = this.getAttribute('selectors');
        let classnames = [];
        try {
            selectors = JSON.parse(selectors);
        } catch (error) {
            console.error('Error parsing selectors:', error);
        }
        // replace classnames with selectors
        for (let key in selectors) {
            classnames[key.toUpperCase()] = selectors[key];
        }

        return classnames;
    }

    connectedCallback() {
        this.initSlider();
    }

    /**
     * Clean up event listeners using global eventListeners array
     * 
     * @returns {void}
     */
    disconnectedCallback() {
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
    }


    initSlider() {
        const swipeContainer = this.querySelector(this.CLASSNAMES.SWIPE_CONTAINER);
        try {
            if (!swipeContainer) {
                throw new Error('Swipe container not found');
            }
        } catch (error) {
            console.error(error);
            return;
        }
        const slides = swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES);
        const totalSlides = slides.length;

        if (this.dataset.sliderInitialized === "true") {
            return;
        }
        this.dataset.sliderInitialized = "true";

        /**
         * Handle slider loopping
         */
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        swipeContainer.appendChild(firstClone); // Add the first clone at the end
        swipeContainer.insertBefore(lastClone, slides[0]); // Add the last clone at the beginning

        // Update total slides including clones
        const allSlides = swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES);
        const clonedSlidesCount = allSlides.length;

        this.querySelector(this.CLASSNAMES.TOTAL_SLIDES).textContent = totalSlides;


    /**
     * Add event listeners for navigation and touch/drag
     * Passing the total slides count to update the pagination separately
     * 
     * @param {HTMLElement} swipeContainer - The swipe container element
     * @param {number} totalSlides - The total number of slides
     * 
     * @returns {void}
     */
    addEventListeners(swipeContainer, totalSlides) {
        const clonedSlidesCount = swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES).length;

        const updateSlides = () => this.updateSlides(swipeContainer, clonedSlidesCount, totalSlides);
        const resetPosition = () => this.resetPosition(swipeContainer, clonedSlidesCount, totalSlides);
        const nextSlide = () => this.moveToNextSlide(updateSlides, clonedSlidesCount);
        const prevSlide = () => this.moveToPrevSlide(updateSlides, clonedSlidesCount);

        this.setupDragAndDrop(swipeContainer, nextSlide, prevSlide, updateSlides);

        this.addListener(this.querySelector(this.CLASSNAMES.PREV_BUTTON), 'click', prevSlide);
        this.addListener(this.querySelector(this.CLASSNAMES.NEXT_BUTTON), 'click', nextSlide);

        this.addListener(swipeContainer, 'transitionend', resetPosition);
    }

    /**
     * Add the event listener globally to be used across component
     * It will be removed in disconnectedCallback
     * 
     * @param {HTMLElement} element - The element to add the event listener to
     * @param {string} event - The event to listen for
     * @param {Function} handler - The event handler
     * 
     * @returns {void}
     */
    addListener(element, event, handler) {
        if (element) {
            element.addEventListener(event, handler);
            this.eventListeners.push({ element, event, handler });
        }
    }
                    : this.currentSlide;
            this.querySelector(this.CLASSNAMES.CURRENT_SLIDE).textContent = displayedSlideIndex;
        };

        
        /**
         * Reset the position on the transition End
         * listener: transitionend
         */
        const resetPosition = () => {
            if (this.currentSlide === 0) {
                this.currentSlide = totalSlides; // Jump to the last real slide
                swipeContainer.style.transition = 'none'; // Disable animation
                swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            } else if (this.currentSlide === clonedSlidesCount - 1) {
                this.currentSlide = 1; // Jump to the first real slide
                swipeContainer.style.transition = 'none'; // Disable animation
                swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
            }
        };

        /**
         * Move to the next slide
         * listener: click
         */
        const nextSlide = () => {
            this.currentSlide = (this.currentSlide + 1) % clonedSlidesCount;
            updateSlides();
        };

        /**
         * Move to the previous slide
         * listener: click
         */
        const prevSlide = () => {
            this.currentSlide = (this.currentSlide - 1 + clonedSlidesCount) % clonedSlidesCount;
            updateSlides();
        };

      
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const touchStart = (e) => {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            isDragging = true;
            swipeContainer.style.transition = 'none'; // Disable transition during swipe
        };

        const touchMove = (e) => {
            if (!isDragging) return;
            currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
            swipeContainer.style.transform = `translateX(${-this.currentSlide * 100 + (currentX / swipeContainer.clientWidth) * 100}%)`;
        };

        const touchEnd = () => {
            if (!isDragging) return;
            swipeContainer.style.transition = 'transform 0.3s ease'; // Re-enable transition
            if (currentX > 50) prevSlide();
            else if (currentX < -50) nextSlide();
            else updateSlides(); // Reset to the current slide if swipe distance is insufficient
            currentX = 0;
            isDragging = false;
        };

        this.addListener(swipeContainer, 'touchstart', touchStart);
        this.addListener(swipeContainer, 'touchmove', touchMove);
        this.addListener(swipeContainer, 'touchend', touchEnd);
        this.addListener(swipeContainer, 'mousedown', touchStart);
        this.addListener(swipeContainer, 'mousemove', touchMove);
        this.addListener(swipeContainer, 'mouseup', touchEnd);
        this.addListener(swipeContainer, 'mouseleave', touchEnd);
    }
}

customElements.define('irnmn-slider', IRNMNSlider);
