class IRNMNSlider extends HTMLElement {

    CLASSNAMES = [];

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
        selectors = JSON.parse(selectors);
        let classnames = [];
        // replace classnames with selectors
        for (let key in selectors) {
            classnames[key.toUpperCase()] = selectors[key];
        }

        return classnames;
    }

    connectedCallback() {
        this.initSlider();
    }

    initSlider() {

        const swipeContainer = this.querySelector(this.CLASSNAMES.SWIPE_CONTAINER);
        if ( !swipeContainer ) {
            console.error('Swipe container not found');
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
         * Update slides position using translateX method
         * 
         * @returns { void }
         */
        const updateSlides = () => {
            swipeContainer.style.transition = 'transform 0.3s ease';
            swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;

            // Update pagination indicator
            const displayedSlideIndex =
                this.currentSlide === 0
                    ? totalSlides // Show last slide index when on the first clone
                    : this.currentSlide === clonedSlidesCount - 1
                    ? 1 // Show first slide index when on the last clone
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

        /**
         * Add event listeners to the swipe wrapper
         * 
         */
        swipeContainer.addEventListener('touchstart', touchStart);
        swipeContainer.addEventListener('touchmove', touchMove);
        swipeContainer.addEventListener('touchend', touchEnd);
        swipeContainer.addEventListener('mousedown', touchStart);
        swipeContainer.addEventListener('mousemove', touchMove);
        swipeContainer.addEventListener('mouseup', touchEnd);
        swipeContainer.addEventListener('mouseleave', touchEnd);

        // Navigation button event listeners
        this.querySelector(this.CLASSNAMES.PREV_BUTTON).addEventListener('click', prevSlide);
        this.querySelector(this.CLASSNAMES.NEXT_BUTTON).addEventListener('click', nextSlide);

        // Transition end event to reset position when looping
        swipeContainer.addEventListener('transitionend', resetPosition);


        // Start from the first real slide
        this.currentSlide = 1;
        swipeContainer.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }
}

customElements.define('irnmn-slider', IRNMNSlider);
