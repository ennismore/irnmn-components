/**
 * <irnmn-carousel> — scroll-snap based carousel
 *
 * Key behaviors:
 * - Native scroll + scroll-snap
 * - Variable-width slides
 * - Active slide = left-snapped slide (closest snap point)
 * - When reaching scroll end, last slide becomes active (logical)
 * - Prev/Next navigation supports a virtual "END" step (maxScroll)
 */

class IRNMNCarousel extends HTMLElement {
    CLASSNAMES = [];

    // Carousel elements
    slides = [];
    snapLefts = [];
    currentIndex = 0;
    viewport = null;
    prevBtn = null;
    nextBtn = null;
    pagerCurrent = null;
    pagerTotal = null;
    ariaLiveRegion = null;

    // Debug flag
    debug = false;

    /**
     * AbortController for event listeners cleanup.
     * @type {AbortController|null}
     */
    _abortController = null;

    /**
     * AbortSignal from the AbortController.
     * @type {AbortSignal|null}
     */
    _signal = null;

    /**
     * ResizeObserver instance for viewport/host resize handling.
     * @type {ResizeObserver|null}
     */
    _resizeObserver = null;

    /**
     * Last index that was announced to assistive tech (aria-live).
     * Used to avoid repeating the same announcement.
     * @type {number|null}
     */
    _lastAnnouncedIndex = null;

    /**
     * Timer id used to detect when scrolling has "settled".
     * @type {number|null}
     */
    _scrollSettledTimer = null;

    /**
     * Scroll-settle debounce duration in ms.
     * Should be short enough to feel responsive, long enough to avoid chatter.
     * @type {number}
     */
    _scrollSettledDelay = 120;

    connected = false;

    constructor() {
        super();
        this.CLASSNAMES = this.selectors;

        const urlParams = new URLSearchParams(window.location.search);
        this.debug = urlParams.get('debugCarousel');

        if (this.debug)
            console.info('[IRNMNCarousel] Constructor', this.CLASSNAMES);
    }

    /* ---------------------------------------------------------------------
     * Helpers
     * ------------------------------------------------------------------ */

    /**
     * * Parse the selectors attribute as JSON.
     *
     * @returns {Object<string, string>}
     */
    get selectors() {
        let selectors = this.getAttribute('selectors');
        let classnames = [];
        try {
            selectors = JSON.parse(selectors);
        } catch (error) {
            console.error('[IRNMNCarousel] Error parsing selectors:', error);
        }
        for (let key in selectors) {
            classnames[key.toUpperCase()] = selectors[key];
        }
        return classnames;
    }

    /**
     * Detect if user prefers reduced motion.
     *
     * @returns {boolean}
     */
    get prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /**
     * Add an event listener that is automatically cleaned up on disconnect.
     *
     * @param {HTMLElement|Window} element
     * @param {string} event
     * @param {Function} handler
     * @param {AddEventListenerOptions} [options={}]
     */
    addListener(element, event, handler, options = {}) {
        if (!element) return;
        // Merge options + inject the signal so it auto-cleans up on abort().
        const mergedOptions = { ...options, signal: this._signal };
        element.addEventListener(event, handler, mergedOptions);
    }

    /**
     * Get the scroll-padding-left value of the viewport.
     *
     * @returns {number}
     */
    getScrollPaddingLeft() {
        const cs = getComputedStyle(this.viewport);
        return parseFloat(cs.scrollPaddingLeft) || 0;
    }

    /**
     * Get the gap size in pixels between slides.
     *
     * @returns {number}
     */
    getGapPx() {
        const cs = getComputedStyle(this.viewport);
        return parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
    }

    /**
     * Get a small tolerance value for rounding / snap settling.
     *
     * @returns {number}
     */
    getEpsilonPx() {
        // small tolerance for rounding / snap settling
        const epsFromGap = this.getGapPx() / 2;
        return Math.max(2, Math.min(12, epsFromGap || 6));
    }

    /**
     * Get the effective scroll position used for snap comparison.
     * Accounts for scroll-padding-left so snapLefts and scrollLeft
     * are in the same coordinate space.
     *
     * @returns {number}
     */
    getScrollPosition() {
        return this.viewport.scrollLeft;
    }

    /**
     * Find the snap index whose snapLeft is closest to the given scroll position.
     * Uses absolute distance and epsilon tolerance.
     *
     * @param {number} pos - current scrollLeft
     * @returns {number}
     */
    getClosestSnapIndex(pos) {
        let bestIndex = 0;
        let bestDist = Infinity;
        const eps = this.getEpsilonPx();

        for (let i = 0; i < this.snapLefts.length; i++) {
            const d = Math.abs(this.snapLefts[i] - pos);

            // Prefer the *earliest* snap when distances are very close
            if (d < bestDist - eps) {
                bestDist = d;
                bestIndex = i;
            }
        }

        return bestIndex;
    }

    /**
     * Get the maximum scrollLeft value for the viewport.
     *
     * @returns {number}
     */
    getMaxScroll() {
        return this.viewport.scrollWidth - this.viewport.clientWidth;
    }

    /**
     * Detects whether the viewport is at the start boundary.
     *
     * @returns {boolean}
     */
    isAtStart() {
        return this.viewport.scrollLeft <= this.getEpsilonPx();
    }

    /**
     * Detects whether the viewport is at the end boundary.
     *
     * @returns {boolean}
     */
    isAtEnd() {
        return (
            this.viewport.scrollLeft >=
            this.getMaxScroll() - this.getEpsilonPx()
        );
    }

    /**
     * Detects whether the viewport is horizontally scrollable.
     * Uses a 1px tolerance to avoid subpixel rounding issues.
     *
     * @returns {boolean}
     */
    isOverflowing() {
        if (!this.viewport) return false;
        return this.viewport.scrollWidth - this.viewport.clientWidth > 1;
    }

    /**
     * Sync host/UI state based on overflow:
     * - toggles `.is-overflowing` on the host (CSS can hide/show controls)
     * - disables prev/next if there is no overflow
     *
     * @returns {void}
     */
    syncOverflowState() {
        const overflowing = this.isOverflowing();
        this.classList.toggle('is-overflowing', overflowing);

        // If there's no overflow, disable controls entirely.
        // If there *is* overflow, the start/end logic will be handled elsewhere.
        if (!overflowing) {
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
        }

        if (this.debug) {
            console.info('[IRNMNCarousel] Overflow:', overflowing);
        }
    }

    /**
     * Schedule a "scroll settled" callback.
     * This debounces rapid scroll events so we only announce once the
     * user has stopped scrolling and the scroll-snap position has stabilized.
     *
     * @returns {void}
     */
    scheduleScrollSettled() {
        // Clear any pending settle timer.
        if (this._scrollSettledTimer) {
            clearTimeout(this._scrollSettledTimer);
            this._scrollSettledTimer = null;
        }

        // Debounce: when no new scroll events happen for a short time,
        // consider the scroll "settled".
        this._scrollSettledTimer = window.setTimeout(() => {
            this._scrollSettledTimer = null;

            // Recompute active index once, then announce if needed.
            // (We do *not* want to announce mid-scroll.)
            this.updateActiveFromScroll({ announce: true });
        }, this._scrollSettledDelay);
    }

    /**
     * Announce the given active index via aria-live, but only if it changed
     * since the last announcement (prevents repetitive chatter).
     *
     * @param {number} index
     * @returns {void}
     */
    announceActiveIndex(index) {
        if (!this.ariaLiveRegion) return;

        if (this._lastAnnouncedIndex === index) return;
        this._lastAnnouncedIndex = index;

        this.ariaLiveRegion.textContent = `Item ${index + 1} of ${this.slides.length}`;
    }

    /* ---------------------------------------------------------------------
     * Lifecycle
     * ------------------------------------------------------------------ */

    connectedCallback() {
        if (this.connected) return;
        this.connected = true;
        this._abortController = new AbortController();
        this._signal = this._abortController.signal;

        this.initCarousel();

        // aria-live creation
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

    disconnectedCallback() {
        this._abortController?.abort();
        this._abortController = null;
        this._signal = null;
        this.connected = false;

        this._resizeObserver?.disconnect();

        if (this.debug) console.info('[IRNMNCarousel] Cleaned up');
    }

    /* ---------------------------------------------------------------------
     * Init
     * ------------------------------------------------------------------ */

    initCarousel() {
        const viewport = this.querySelector(this.CLASSNAMES.VIEWPORT);
        if (!viewport) {
            console.error('[IRNMNCarousel] Viewport not found');
            return;
        }

        this.viewport = viewport;
        this.viewport.setAttribute('tabindex', '0');
        this.viewport.setAttribute('role', 'region');
        this.viewport.setAttribute('aria-roledescription', 'carousel');

        this.slides = Array.from(
            viewport.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        this.prevBtn = this.querySelector(this.CLASSNAMES.PREV_BUTTON);
        this.nextBtn = this.querySelector(this.CLASSNAMES.NEXT_BUTTON);
        this.pagerCurrent = this.querySelector(this.CLASSNAMES.CURRENT_SLIDE);
        this.pagerTotal = this.querySelector(this.CLASSNAMES.TOTAL_SLIDES);
        this._lastAnnouncedIndex = null;

        this.updateTotal();
        this.initSlidesAttributes();

        this.calculateSnapLefts();
        this.syncOverflowState();

        this.addScrollListener();
        this.addControlsListeners();
        this.addKeyboardSupport();
        this.setupResizeObserver();

        // Initial sync after layout settles
        requestAnimationFrame(() => {
            this.calculateSnapLefts();
            this.syncOverflowState();
            this.updateActiveFromScroll();
        });

        this.addListener(
            window,
            'load',
            () => {
                this.calculateSnapLefts();
                this.updateActiveFromScroll();
            },
            { once: true },
        );

        if (this.debug) console.info('[IRNMNCarousel] Initialized');
    }

    updateTotal() {
        if (this.pagerTotal)
            this.pagerTotal.textContent = String(this.slides.length);
        if (this.pagerCurrent) this.pagerCurrent.textContent = '1';
    }

    initSlidesAttributes() {
        const total = this.slides.length;
        this.slides.forEach((slide, i) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            if (!slide.hasAttribute('aria-label')) {
                slide.setAttribute('aria-label', `Item ${i + 1} of ${total}`);
            }
            slide.removeAttribute('tabindex'); // focus on viewport
        });
    }

    /* ---------------------------------------------------------------------
     * Geometry
     * ------------------------------------------------------------------ */

    calculateSnapLefts() {
        const scrollPaddingLeft = this.getScrollPaddingLeft();

        // Convert slide "start" to scrollLeft space.
        this.snapLefts = this.slides.map(
            (slide) => slide.offsetLeft - scrollPaddingLeft,
        );

        if (this.debug)
            console.info('[IRNMNCarousel] snapLefts', this.snapLefts);
    }

    getLastReachableSnapIndex() {
        const maxScroll = this.getMaxScroll();

        // Greatest snapLeft <= maxScroll (the last *left-alignable* slide)
        let lastReachable = 0;
        for (let i = 0; i < this.snapLefts.length; i++) {
            if (this.snapLefts[i] <= maxScroll + 1) lastReachable = i;
            else break;
        }
        return lastReachable;
    }

    /* ---------------------------------------------------------------------
     * Scroll handling
     * ------------------------------------------------------------------ */

    /**
     * Setup ResizeObserver to recalculate snap points on resize.
     * @returns {void}
     */
    setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => {
            this.calculateSnapLefts();
            this.syncOverflowState();
            this.updateActiveFromScroll();
        });
        this._resizeObserver.observe(this.viewport);
    }

    /**
     * Add scroll listener with requestAnimationFrame throttling.
     * @returns {void}
     */
    addScrollListener() {
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                this.syncOverflowState();

                // Update active index silently during scrolling.
                this.updateActiveFromScroll({ announce: false });

                // Schedule a single announcement once scrolling stops.
                this.scheduleScrollSettled();

                ticking = false;
            });
        };

        this.addListener(this.viewport, 'scroll', onScroll, { passive: true });
    }

    /**
     * Update active index based on current scroll position.
     * By default, does not announce (to avoid chatter while scrolling).
     *
     * @param {{ announce?: boolean }} [opts]
     * @returns {void}
     */
    updateActiveFromScroll(opts = {}) {
        const { announce = false } = opts;

        if (!this.snapLefts.length) return;

        const pos = this.getScrollPosition();

        // When reaching physical scroll end, force last slide active (logical)
        if (this.isAtEnd()) {
            this.setActiveIndex(this.slides.length - 1, { announce });
            this.updateControlsDisabledState();
            return;
        }

        const index = this.getClosestSnapIndex(pos);

        this.setActiveIndex(index, { announce });
        this.updateControlsDisabledState();
    }

    /**
     * Disable prev/next based on:
     * - overflow existence (no overflow => both disabled)
     * - physical scroll bounds (start/end)
     *
     * @returns {void}
     */
    updateControlsDisabledState() {
        // If nothing to scroll, keep everything disabled.
        if (!this.isOverflowing()) {
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
            return;
        }

        // Important: disable based on physical scroll limits, not logical index.
        if (this.prevBtn) this.prevBtn.disabled = this.isAtStart();
        if (this.nextBtn) this.nextBtn.disabled = this.isAtEnd();
    }

    /**
     * Update active index and DOM state.
     *
     * @param {number} index
     * @param {{ announce?: boolean }} [opts]
     * @returns {void}
     */
    setActiveIndex(index, opts = {}) {
        const { announce = false } = opts;

        if (index === this.currentIndex) {
            // Even if index didn't change, we may want to announce on-settle,
            // but only if it wasn't already announced.
            if (announce) this.announceActiveIndex(index);
            return;
        }

        this.currentIndex = index;

        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === index);
        });

        if (this.pagerCurrent) {
            this.pagerCurrent.textContent = String(index + 1);
        }

        // Only announce when explicitly requested (scroll-settled / button nav).
        if (announce) {
            this.announceActiveIndex(index);
        }

        this.dispatchEvent(
            new CustomEvent('carouselChange', {
                bubbles: true,
                detail: {
                    currentIndex: index,
                    currentElement: this.slides[index],
                    total: this.slides.length,
                },
            }),
        );

        if (this.debug) console.info('[IRNMNCarousel] Active index', index);
    }

    /* ---------------------------------------------------------------------
     * Controls
     * ------------------------------------------------------------------ */

    /**
     * Add click listeners to prev/next buttons.
     * @returns {void}
     */
    addControlsListeners() {
        const scrollToLeft = (left) => {
            this.viewport.scrollTo({
                left,
                behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
            });
        };

        const scrollToSnapIndex = (snapIndex) => {
            const clamped = Math.max(
                0,
                Math.min(this.snapLefts.length - 1, snapIndex),
            );
            scrollToLeft(this.snapLefts[clamped]);
        };

        this.addListener(this.prevBtn, 'click', () => {
            const lastReachable = this.getLastReachableSnapIndex();

            // If we are at END, going prev should go to last reachable snap
            if (this.isAtEnd() && lastReachable < this.slides.length - 1) {
                scrollToSnapIndex(lastReachable);
                return;
            }

            // Otherwise go one snap back from the current snapped slide
            // Use closest snap (currentIndex) as the working snap index.
            scrollToSnapIndex(this.currentIndex - 1);
        });

        this.addListener(this.nextBtn, 'click', () => {
            const lastReachable = this.getLastReachableSnapIndex();

            // If we're already at END, nothing to do
            if (this.isAtEnd()) return;

            // If next snap exists within reachable snaps, go to it
            if (this.currentIndex < lastReachable) {
                scrollToSnapIndex(this.currentIndex + 1);
                return;
            }

            // Otherwise, jump to END (maxScroll) so the last slide can become active
            scrollToLeft(this.getMaxScroll());
        });
    }

    /**
     * Add keyboard navigation support.
     * @returns {void}
     */
    addKeyboardSupport() {
        this.addListener(this.viewport, 'keydown', (e) => {
            if (!this.contains(document.activeElement)) return;

            // Ignore keyboard navigation when user is typing in a form field
            if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextBtn?.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.prevBtn?.click();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.viewport.scrollTo({ left: 0 });
                    break;
                case 'End':
                    e.preventDefault();
                    this.viewport.scrollTo({ left: this.getMaxScroll() });
                    break;
            }
        });
    }

    /* ---------------------------------------------------------------------
     * Public API
     * ------------------------------------------------------------------ */

    refresh() {
        if (!this.viewport) return;
        this._lastAnnouncedIndex = null;

        this.slides = Array.from(
            this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES),
        );
        this.updateTotal();
        this.calculateSnapLefts();
        this.updateActiveFromScroll();

        if (this.debug) console.info('[IRNMNCarousel] Refreshed');
    }
}

if (!customElements.get('irnmn-carousel')) {
    customElements.define('irnmn-carousel', IRNMNCarousel);
}
