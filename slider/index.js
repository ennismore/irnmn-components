class IRNMNSlider extends HTMLElement {
    CLASSNAMES = [];
    eventListeners = [];
    slides = [];
    slideOffsets = [];
    currentSlide = 1;

    constructor() {
        super();
        this.CLASSNAMES = this.selectors;
        const urlParams = new URLSearchParams(window.location.search);
        this.debug = urlParams.get('debugTracking');
        // Debug: Log constructor initialization
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Constructor called, CLASSNAMES:',
                this.CLASSNAMES,
            );
        }
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
     * Get the transition value from the attribute or fallback.
     * Automatically disables transition for users who prefer reduced motion.
     *
     * @returns {string} - The transition string
     */
    get transition() {
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (prefersReducedMotion) {
            return '0.001s ease'; // Disable transition for reduced motion users (very quick transition effect to simulate no transition)
        }
        const attr = this.getAttribute('transition');
        return typeof attr === 'string' && attr.trim() ? attr : '0.3s ease';
    }

    connectedCallback() {
        // Wait for visibility before initializing
        const observer = new IntersectionObserver(
            ([entry], obs) => {
                if (entry.isIntersecting) {
                    if (this.debug) {
                        console.info(
                            '[IRNMNSlider] Element is visible, initializing slider...',
                        );
                    }
                    this.initSlider();
                    obs.disconnect();
                }
            },
            { root: null, threshold: 0 },
        );
        observer.observe(this);
        // Debug: Log when observer is set up
        if (this.debug) {
            console.info('[IRNMNSlider] IntersectionObserver set up.');
        }

        // Add aria-live region for accessibility
        this.ariaLiveRegion = document.createElement('div');
        this.ariaLiveRegion.setAttribute('aria-live', 'polite');
        this.ariaLiveRegion.setAttribute('aria-atomic', 'true');
        this.ariaLiveRegion.classList.add('visually-hidden');
        Object.assign(this.ariaLiveRegion.style, {
            position: 'absolute',
            height: '1px',
            width: '1px',
            overflow: 'hidden',
            clip: 'rect(1px, 1px, 1px, 1px)',
            whiteSpace: 'nowrap',
        });
        this.appendChild(this.ariaLiveRegion);
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
        // Debug: Log cleanup
        if (this.debug) {
            console.info('[IRNMNSlider] Event listeners cleaned up.');
        }
    }

    initSlider() {
        const swipeContainer = this.querySelector(
            this.CLASSNAMES.SWIPE_CONTAINER,
        );
        if (!swipeContainer) {
            console.error('Swipe container not found');
            return;
        }
        // Ensure the swipe container has a unique ID
        if (!swipeContainer.id) {
            swipeContainer.id = `slider-container-${Math.floor(Math.random() * 1000000)}`;
        }
        this.setupResizeListener(swipeContainer);

        // Initialize slides
        this.slides = Array.from(
            swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        // Accessbility attributes
        swipeContainer.setAttribute('role', 'region');
        if (
            !swipeContainer.hasAttribute('aria-label') &&
            !swipeContainer.hasAttribute('aria-labelledby')
        ) {
            swipeContainer.setAttribute(
                'aria-label',
                'Slideshow with multiple slides',
            );
        }
        swipeContainer.setAttribute('tabindex', '0');
        swipeContainer.setAttribute('aria-roledescription', 'carousel');

        const prevBtn = this.querySelector(this.CLASSNAMES.PREV_BUTTON);
        const nextBtn = this.querySelector(this.CLASSNAMES.NEXT_BUTTON);

        if (prevBtn && !prevBtn.hasAttribute('aria-label')) {
            prevBtn.setAttribute('aria-label', 'Previous slide');
            prevBtn.setAttribute('aria-controls', swipeContainer.id);
        }
        if (nextBtn && !nextBtn.hasAttribute('aria-label')) {
            nextBtn.setAttribute('aria-label', 'Next slide');
            nextBtn.setAttribute('aria-controls', swipeContainer.id);
        }

        const totalSlides = this.slides.length;

        /**
         * Handle single slide case
         */
        if (totalSlides === 1) {
            if (this.debug) {
                console.info(
                    '[IRNMNSlider] Only one slide detected, rendering single slide.',
                );
            }
            this.renderSingleSlide(this.slides[0]);
            return;
        }

        if (this.dataset.sliderInitialized === 'true') {
            if (this.debug) {
                console.info(
                    '[IRNMNSlider] Slider already initialized, skipping.',
                );
            }
            return;
        }
        this.dataset.sliderInitialized = 'true';

        this.cloneSlides(swipeContainer);
        this.calculateSlideOffsets(swipeContainer);
        this.updateTotalSlides(totalSlides);
        this.initializePosition(swipeContainer);
        this.addEventListeners(swipeContainer, totalSlides);
        this.initSlidesAttributes();
        this.updateSlidesAttributes(1); // Start with the first slide as active

        // Debug: Log initialization complete
        if (this.debug) {
            console.info('[IRNMNSlider] Slider initialization complete.');
        }
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

                // Debug: Log resize event
                if (this.debug) {
                    console.info(
                        '[IRNMNSlider] Window resized, recalculated offsets and centered slide.',
                    );
                }
            }, 150);
        };

        window.addEventListener('resize', onResize);

        // Track the resize listener for cleanup
        this.eventListeners.push({
            element: window,
            event: 'resize',
            handler: onResize,
        });
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

        // Debug: Log single slide rendering
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Navigation and controls removed for single slide.',
            );
        }
    }

    /**
     * Clone first and last slides to enable looping
     */
    cloneSlides(swipeContainer) {
        // Remove any existing clones to avoid duplicates
        swipeContainer
            .querySelectorAll('.clone-slide')
            .forEach((clone) => clone.remove());

        // Clone first and last slides for infinite loop
        const firstSlide = this.slides[0];
        const lastSlide = this.slides[this.slides.length - 1];

        if (firstSlide && lastSlide) {
            const firstClone = firstSlide.cloneNode(true);
            const lastClone = lastSlide.cloneNode(true);

            firstClone.dataset.clone = 'true';
            lastClone.dataset.clone = 'true';
            firstClone.classList.add('clone-slide');
            lastClone.classList.add('clone-slide');

            swipeContainer.appendChild(firstClone); // Add first clone at the end
            swipeContainer.insertBefore(lastClone, firstSlide); // Add last clone at the beginning
        }

        // Update the slides property to include the clones
        this.slides = Array.from(
            swipeContainer.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        // Debug: Log cloning
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Slides cloned for infinite loop. Total slides (with clones):',
                this.slides.length,
            );
        }
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

        // Debug: Log offsets calculation
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Slide offsets calculated:',
                this.slideOffsets,
            );
        }
    }

    /**
     * Update the total number of slides
     *
     * @param {number} totalSlides - The total number of slides
     * @returns {void}
     */
    updateTotalSlides(totalSlides) {
        const totalSlidesElem = this.querySelector(
            this.CLASSNAMES.TOTAL_SLIDES,
        );
        if (totalSlidesElem) {
            totalSlidesElem.textContent = totalSlides;
        }
        // Debug: Log total slides update
        if (this.debug) {
            console.info('[IRNMNSlider] Total slides updated:', totalSlides);
        }
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

        // Debug: Log position initialization
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Slider position initialized to slide:',
                this.currentSlide,
            );
        }
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

        const updateSlides = () =>
            this.updateSlides(swipeContainer, clonedSlidesCount, totalSlides);
        const resetPosition = () =>
            this.resetPosition(swipeContainer, clonedSlidesCount, totalSlides);
        const nextSlide = () =>
            this.moveToNextSlide(updateSlides, clonedSlidesCount);
        const prevSlide = () =>
            this.moveToPrevSlide(updateSlides, clonedSlidesCount);

        this.setupDragAndDrop(
            swipeContainer,
            nextSlide,
            prevSlide,
            updateSlides,
        );

        this.addListener(
            this.querySelector(this.CLASSNAMES.PREV_BUTTON),
            'click',
            prevSlide,
        );
        this.addListener(
            this.querySelector(this.CLASSNAMES.NEXT_BUTTON),
            'click',
            nextSlide,
        );

        this.addListener(swipeContainer, 'transitionend', resetPosition);

        this.addListener(swipeContainer, 'keydown', (e) => {
            if (
                !this.dataset.sliderInitialized ||
                !this.contains(document.activeElement)
            )
                return;

            switch (e.key) {
                case 'ArrowRight':
                case 'Right':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'Left':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.currentSlide = 1;
                    updateSlides();
                    break;
                case 'End':
                    e.preventDefault();
                    this.currentSlide = totalSlides;
                    updateSlides();
                    break;
            }
        });

        // Debug: Log event listeners added
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Navigation, drag and keyboard event listeners added.',
            );
        }
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

        // Debug: Log centering
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Centered slide:',
                this.currentSlide,
                'Offset:',
                offset,
                'Width:',
                slideWidth,
            );
        }
    }

    initSlidesAttributes() {
        const totalSlides = this.querySelectorAll(
            `${this.CLASSNAMES.SLIDES}:not([data-clone])`,
        ).length;

        this.slides.forEach((slide, i) => {
            const isClone = slide.dataset.clone === 'true';

            if (isClone) {
                slide.setAttribute('aria-hidden', 'true');
                slide.setAttribute('tabindex', '-1');
                slide.removeAttribute('role');
                slide.removeAttribute('aria-roledescription');
                slide.removeAttribute('aria-label');
            } else {
                slide.setAttribute('role', 'group');
                slide.setAttribute('aria-roledescription', 'slide');
                if (!slide.hasAttribute('aria-label')) {
                    slide.setAttribute(
                        'aria-label',
                        `Slide ${i} of ${totalSlides}`,
                    );
                }
            }
        });
    }

    /**
     * Updates accessibility attributes and active state for each slide.
     */
    updateSlidesAttributes(displayedSlideIndex) {
        this.slides.forEach((slide, i) => {
            const isClone = slide.dataset.clone === 'true';
            if (isClone) return;

            const isActive = i === displayedSlideIndex;
            slide.setAttribute('tabindex', isActive ? '0' : '-1');
            slide.classList.toggle('active-slide', isActive);
        });
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

        this.updateSlidesAttributes(displayedSlideIndex);

        const currentSlideElem = this.querySelector(
            this.CLASSNAMES.CURRENT_SLIDE,
        );
        if (currentSlideElem) {
            currentSlideElem.textContent = displayedSlideIndex;
        }

        // Accessibility: announce the current slide
        if (this.ariaLiveRegion) {
            const announcement = `Slide ${displayedSlideIndex} of ${totalSlides}`;
            this.ariaLiveRegion.textContent = announcement;
        }

        // Dispatch a custom event when the slide changes
        const slideChangeEvent = new CustomEvent('slideChange', {
            detail: {
                currentSlideIndex: this.currentSlide,
                currentSlideDisplayedIndex: displayedSlideIndex,
                currentSlideElement: this.slides[this.currentSlide],
                totalSlides: totalSlides,
                clonedSlidesCount: clonedSlidesCount,
            },
        });
        swipeContainer.dispatchEvent(slideChangeEvent);

        // Debug: Log slide update
        if (this.debug) {
            console.info('[IRNMNSlider] Slide updated:', {
                currentSlide: this.currentSlide,
                displayedSlideIndex,
                totalSlides,
                clonedSlidesCount,
            });
        }
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
        this.classList.remove('transitioning-prev');
        this.classList.remove('transitioning-next');

        // Ensure focus is returned to the current slide
        const focusedElement = document.activeElement;
        // If focus is on the slide itself or anywhere within a slide (including its children), send focus back to the current slide
        if (
            focusedElement &&
            this.slides.some(
                (slide) =>
                    slide === focusedElement || slide.contains(focusedElement),
            )
        ) {
            const currentSlideElem = this.slides[this.currentSlide];
            if (currentSlideElem) {
                currentSlideElem.focus();
            }
        }

        // Debug: Log position reset
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Position reset after transition. Current slide:',
                this.currentSlide,
            );
        }
    }

    /**
     * Move to the next slide
     */
    moveToNextSlide(updateSlides, clonedSlidesCount) {
        if (
            this.classList.contains('transitioning-next') ||
            this.classList.contains('transitioning-prev')
        )
            return;
        this.classList.add('transitioning-next');
        this.currentSlide = (this.currentSlide + 1) % clonedSlidesCount;
        updateSlides();

        // Debug: Log next slide
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Moved to next slide:',
                this.currentSlide,
            );
        }
    }

    /**
     * Move to the previous slide
     */
    moveToPrevSlide(updateSlides, clonedSlidesCount) {
        if (
            this.classList.contains('transitioning-next') ||
            this.classList.contains('transitioning-prev')
        )
            return;
        this.classList.add('transitioning-prev');
        this.currentSlide =
            (this.currentSlide - 1 + clonedSlidesCount) % clonedSlidesCount;
        updateSlides();

        // Debug: Log previous slide
        if (this.debug) {
            console.info(
                '[IRNMNSlider] Moved to previous slide:',
                this.currentSlide,
            );
        }
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

            // Debug: Log drag start
            if (this.debug) {
                console.info('[IRNMNSlider] Drag/touch start:', startX);
            }
        };

        const touchMove = (e) => {
            if (!isDragging) return;
            currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
            const offset = this.slideOffsets[this.currentSlide];
            const slideWidth = this.slides[this.currentSlide].offsetWidth;
            swipeContainer.style.transform = `translateX(calc(-${offset}px + 50% - ${slideWidth / 2}px + ${currentX}px))`;

            // Debug: Log drag move
            if (this.debug) {
                console.info('[IRNMNSlider] Drag/touch move:', currentX);
            }
        };

        const touchEnd = () => {
            if (!isDragging) return;
            swipeContainer.style.transition = this.transition;
            if (currentX > 50) prevSlide();
            else if (currentX < -50) nextSlide();
            else updateSlides();
            currentX = 0;
            isDragging = false;

            // Debug: Log drag end
            if (this.debug) {
                console.info('[IRNMNSlider] Drag/touch end.');
            }
        };

        this.addListener(swipeContainer, 'touchstart', touchStart);
        this.addListener(swipeContainer, 'touchmove', touchMove);
        this.addListener(swipeContainer, 'touchend', touchEnd);
        this.addListener(swipeContainer, 'mousedown', touchStart);
        this.addListener(swipeContainer, 'mousemove', touchMove);
        this.addListener(swipeContainer, 'mouseup', touchEnd);
        this.addListener(swipeContainer, 'mouseleave', touchEnd);

        // Debug: Log drag and drop setup
        if (this.debug) {
            console.info('[IRNMNSlider] Drag and drop/touch listeners set up.');
        }
    }

    refresh() {
        const swipeContainer = this.querySelector(
            this.CLASSNAMES.SWIPE_CONTAINER,
        );
        if (!swipeContainer) {
            console.error('Swipe container not found');
            return;
        }
        this.calculateSlideOffsets(swipeContainer);
        this.centerSlide(swipeContainer);

        // Debug: Log refresh
        if (this.debug) {
            console.info('[IRNMNSlider] Slider refreshed.');
        }
    }
}

if (!customElements.get('irnmn-slider')) {
    customElements.define('irnmn-slider', IRNMNSlider);
}
