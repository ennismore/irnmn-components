class IRNMNSlider extends HTMLElement {
    CLASSNAMES = [];
    eventListeners = [];
    slides = [];
    slideOffsets = [];
    currentSlide = 1;

    constructor() {
        super();
        this.CLASSNAMES = this.selectors;
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
        if (!swipeContainer) {
            console.error('Swipe container not found');
            return;
        }
        this.setupResizeListener(swipeContainer);

        // Initialize slides
        this.slides = Array.from(swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES));

        // Accessbility attributes
        swipeContainer.setAttribute('role', 'region');
        swipeContainer.setAttribute('aria-label', 'Slideshow with multiple slides');

        const totalSlides = this.slides.length;

        /**
         * Handle single slide case
         */
        if (totalSlides === 1) {
            this.renderSingleSlide(this.slides[0]);
            return;
        }

        if (this.dataset.sliderInitialized === "true") {
            return;
        }
        this.dataset.sliderInitialized = "true";

        this.cloneSlides(swipeContainer,);
        this.calculateSlideOffsets(swipeContainer);
        this.updateTotalSlides(totalSlides);
        this.initializePosition(swipeContainer);
        this.addEventListeners(swipeContainer, totalSlides);
    }

    /**
     * Sets up the resize event listener to recalculate offsets
     * and center the current slide when the window is resized.
     * Debounces the resize handler to optimize performance.
     *
     * @param {HTMLElement} swipeContainer - The container element for the slider
     * @returns {void}
     */
    setupResizeListener(swipeContainer) {
        let resizeTimeout;

        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!swipeContainer) return;

                // Recalculate offsets and center the current slide
                this.calculateSlideOffsets(swipeContainer);
                this.centerSlide(swipeContainer);
            }, 150);
        };

        window.addEventListener('resize', onResize);

        // Track the resize listener for cleanup
        this.eventListeners.push({ element: window, event: 'resize', handler: onResize });
    }

    /**
     * Sets up the resize event listener to recalculate offsets
     * and center the current slide when the window is resized.
     *
     * @returns {void}
     */
    setupResizeListener(swipeContainer) {
        const onResize = () => {
            if (!swipeContainer) return;

            // Recalculate offsets and center the current slide
            this.calculateSlideOffsets(swipeContainer);
            this.centerSlide(swipeContainer);
        };

        window.addEventListener('resize', onResize);

        // Track the resize listener for cleanup
        this.eventListeners.push({ element: window, event: 'resize', handler: onResize });
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
    cloneSlides(swipeContainer) {
        const firstClone = this.slides[0].cloneNode(true);
        const lastClone = this.slides[this.slides.length - 1].cloneNode(true);
        swipeContainer.appendChild(firstClone); // Add the first clone at the end
        swipeContainer.insertBefore(lastClone, this.slides[0]); // Add the last clone at the beginning

        // Update the slides property to include the clones
        this.slides = Array.from(swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES));
    }

    /**
     * Calculates the cumulative offsets for all slides based on their widths.
     * These offsets are used to determine the correct translation amount for
     * centering each slide, especially when slides have varying widths.
     *
     * @returns {void}
     */
    calculateSlideOffsets() {
        this.slideOffsets = [0];
        let cumulativeOffset = 0;

        this.slides.forEach((slide) => {
            cumulativeOffset += slide.offsetWidth;
            this.slideOffsets.push(cumulativeOffset);
        });
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
        swipeContainer.style.transition = 'none';
        this.centerSlide(swipeContainer);
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
        const clonedSlidesCount = this.slides.length;

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
     * Centers the currently active slide in the viewport.
     * Calculates the translation value based on the current slide's offset and width,
     * ensuring that the slide is perfectly centered horizontally.
     *
     * @param {HTMLElement} swipeContainer - The container element holding all the slides
     * @returns {void}
     */
    centerSlide(swipeContainer) {
        const offset = this.slideOffsets[this.currentSlide];
        const slideWidth = this.slides[this.currentSlide].offsetWidth;
        swipeContainer.style.transform = `translateX(calc(-${offset}px + 50% - ${slideWidth / 2}px))`;
    }

    /**
     * Update slides position and pagination
     */
    updateSlides(swipeContainer, clonedSlidesCount, totalSlides) {
        swipeContainer.style.transition = this.transition;
        this.centerSlide(swipeContainer);

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
        // Dispatch a custom event when the slide changes
        const slideChangeEvent = new CustomEvent('slideChange', {
            detail: {
                currentSlideIndex: this.currentSlide,
                currentSlideDisplayedIndex: displayedSlideIndex,
                currentSlideElement: this.slides[this.currentSlide],
                totalSlides: totalSlides,
                clonedSlidesCount: clonedSlidesCount
            }
        });
        swipeContainer.dispatchEvent(slideChangeEvent);
    }

    /**
     * Reset the position on the transition end
     */
    resetPosition(swipeContainer, clonedSlidesCount, totalSlides) {
        if (this.currentSlide === 0) {
            this.currentSlide = totalSlides;
        } else if (this.currentSlide === clonedSlidesCount - 1) {
            this.currentSlide = 1;
        }
        swipeContainer.style.transition = 'none';
        this.centerSlide(swipeContainer);
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
            const offset = this.slideOffsets[this.currentSlide];
            const slideWidth = this.slides[this.currentSlide].offsetWidth;
            swipeContainer.style.transform = `translateX(calc(-${offset}px + 50% - ${slideWidth / 2}px + ${currentX}px))`;
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
