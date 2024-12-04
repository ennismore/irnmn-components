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

    /**
     * Get the transition value from the attribute or fallback
     * 
     * @returns {string} - The transition string
     */
    get transition() {
        return this.getAttribute('transition') || '0.3s ease';
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
        // Accessbility attributes
        swipeContainer.setAttribute('role', 'region');
        swipeContainer.setAttribute('aria-label', 'Slideshow with multiple slides');
    
        const slides = swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES);
        const totalSlides = slides.length;
    
        /**
         * Handle single slide case
         */
        if (totalSlides === 1) {
            this.renderSingleSlide(slides[0]);
            return;
        }
    
        if (this.dataset.sliderInitialized === "true") {
            return;
        }
        this.dataset.sliderInitialized = "true";
    
        this.cloneSlides(swipeContainer, slides);
        this.updateTotalSlides(totalSlides);
        this.initializePosition(swipeContainer);
        this.addEventListeners(swipeContainer, totalSlides);
    }

    /**
     * Fall back to a single slide if only one slide is present
     * 
     * @param {HTMLElement} singleSlide - The single slide element
     * @returns {void}
     */
    renderSingleSlide(singleSlide) {
        singleSlide.style.cssText = 'display: block; margin: 0 auto;'; // Inline styles for single slide
    
        // Remove navigation and pagination controls if they exist
        this.querySelector(this.CLASSNAMES.PREV_BUTTON)?.remove();
        this.querySelector(this.CLASSNAMES.NEXT_BUTTON)?.remove();
        this.querySelector(this.CLASSNAMES.CONTROLS)?.remove();
    }

    /**
     * Clone first and last slides to enable looping
     */
    cloneSlides(swipeContainer, slides) {
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);
        swipeContainer.appendChild(firstClone); // Add the first clone at the end
        swipeContainer.insertBefore(lastClone, slides[0]); // Add the last clone at the beginning
    }

    /**
     * Update the total number of slides
     * 
     * @param {number} totalSlides - The total number of slides
     * @returns {void}
     */
    updateTotalSlides(totalSlides) {
        this.querySelector(this.CLASSNAMES.TOTAL_SLIDES).textContent = totalSlides;
    }

    /**
     * Initialize the slider position
     * 
     * @param {HTMLElement} swipeContainer - The swipe container element
     * @returns {void}
     */
    initializePosition(swipeContainer) {
        this.currentSlide = 1;
        swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

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

    /**
     * Update slides position and pagination
     */
    updateSlides(swipeContainer, clonedSlidesCount, totalSlides) {
        swipeContainer.style.transition = this.transition;
        swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;

        let displayedSlideIndex;

        switch (this.currentSlide) {
            case 0:
            displayedSlideIndex = totalSlides;
            break;
            case clonedSlidesCount - 1:
            displayedSlideIndex = 1;
            break;
            default:
            displayedSlideIndex = this.currentSlide;
            break;
        }

        this.querySelector(this.CLASSNAMES.CURRENT_SLIDE).textContent = displayedSlideIndex;
    }

    /**
     * Reset the position on the transition end
     */
    resetPosition(swipeContainer, clonedSlidesCount, totalSlides) {
        if (this.currentSlide === 0) {
            this.currentSlide = totalSlides;
            swipeContainer.style.transition = 'none';
            swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        } else if (this.currentSlide === clonedSlidesCount - 1) {
            this.currentSlide = 1;
            swipeContainer.style.transition = 'none';
            swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }
    }

    /**
     * Move to the next slide
     */
    moveToNextSlide(updateSlides, clonedSlidesCount) {
        this.currentSlide = (this.currentSlide + 1) % clonedSlidesCount;
        updateSlides();
    }

    /**
     * Move to the previous slide
     */
    moveToPrevSlide(updateSlides, clonedSlidesCount) {
        this.currentSlide = (this.currentSlide - 1 + clonedSlidesCount) % clonedSlidesCount;
        updateSlides();
    }

    /**
     * Setup drag and drop (or touch) event listeners
     * 
     * @param {HTMLElement} swipeContainer - The swipe container element
     * @param {Function} nextSlide - The function to move to the next slide
     * @param {Function} prevSlide - The function to move to the previous slide
     * @param {Function} updateSlides - The function to update the slides
     * 
     * @returns {void}
     */
    setupDragAndDrop(swipeContainer, nextSlide, prevSlide, updateSlides) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        const touchStart = (e) => {
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            isDragging = true;
            swipeContainer.style.transition = 'none';
        };

        const touchMove = (e) => {
            if (!isDragging) return;
            currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
            swipeContainer.style.transform = `translateX(${-this.currentSlide * 100 + (currentX / swipeContainer.clientWidth) * 100}%)`;
        };

        const touchEnd = () => {
            if (!isDragging) return;
            swipeContainer.style.transition = this.transition;
            if (currentX > 50) prevSlide();
            else if (currentX < -50) nextSlide();
            else updateSlides();
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
