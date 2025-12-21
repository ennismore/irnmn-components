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
    /* ---------------------------------------------------------------------
     * State & configuration
     * ------------------------------------------------------------------ */

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
     * Cached RTL scroll behavior type for the current browser.
     * Types:
     * - "negative": Chrome/Safari (scrollLeft goes negative when scrolling right in RTL)
     * - "reverse": Firefox (scrollLeft=0 at right, scrollLeft=maxScroll at left)
     * - "default": IE/Edge legacy (scrollLeft=0 at left, same as LTR)
     * @type {"negative"|"reverse"|"default"|null}
     */
    _rtlScrollType = null;

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

    /**
     * RequestAnimationFrame ID for scroll throttling cleanup.
     * @type {number|null}
     */
    _scrollRafId = null;

    connected = false;

    /**
     * Create a new IRNMNCarousel instance.
     * Reads selectors config and optional debug flag from URL.
     */
    constructor() {
        super();
        this.CLASSNAMES = this.selectors;

        const urlParams = new URLSearchParams(window.location.search);
        this.debug = urlParams.get('debugCarousel');

        if (this.debug)
            console.info('[IRNMNCarousel] Constructor', this.CLASSNAMES);
    }

    /* ---------------------------------------------------------------------
     * Computed getters
     * ------------------------------------------------------------------ */

    /**
     * Parse the selectors attribute as JSON and return a normalized map
     * (keys uppercased for internal usage).
     *
     * @returns {Object<string, string>}
     */
    get selectors() {
        let selectors = this.getAttribute('selectors');
        let classnames = {};
        try {
            selectors = JSON.parse(selectors);
        } catch (error) {
            console.error('[IRNMNCarousel] Error parsing selectors:', error);
            return classnames;
        }
        for (let key in selectors) {
            classnames[key.toUpperCase()] = selectors[key];
        }
        return classnames;
    }

    /**
     * Detect if user prefers reduced motion (A11y).
     *
     * @returns {boolean}
     */
    get prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* ---------------------------------------------------------------------
     * Low-level helpers
     * ------------------------------------------------------------------ */

    /**
     * Add an event listener that is automatically cleaned up on disconnect (via AbortController).
     *
     * @param {HTMLElement|Window} element
     * @param {string} event
     * @param {Function} handler
     * @param {AddEventListenerOptions} [options={}]
     * @returns {void}
     */
    addListener(element, event, handler, options = {}) {
        if (!element) return;
        const mergedOptions = { ...options, signal: this._signal };
        element.addEventListener(event, handler, mergedOptions);
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
        const epsFromGap = this.getGapPx() / 2 || 6; // fallback to 6 if gap is 0
        return Math.max(2, Math.min(12, epsFromGap)); // clamp between 2 and 12px
    }

    /* ---------------------------------------------------------------------
     * RTL & scroll normalization
     * ------------------------------------------------------------------ */

    /**
     * Detect whether the carousel is in RTL mode.
     *
     * @returns {boolean}
     */
    isRTL() {
        return getComputedStyle(this.viewport).direction === 'rtl';
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
     * Get a normalized scroll position that always represents
     * "distance from the left edge" of the scrollable content.
     *
     * @returns {number}
     */
    getScrollPosition() {
        const el = this.viewport;
        const raw = el.scrollLeft;

        if (!this.isRTL()) return raw;

        const maxScroll = this.getMaxScroll();
        const type = this.getRTLScrollType();

        if (type === 'negative') return -raw;
        if (type === 'reverse') return maxScroll - raw;
        return raw;
    }

    /**
     * Scroll viewport to a normalized logical position.
     *
     * @param {number} logicalLeft
     * @returns {void}
     */
    scrollToLogicalPosition(logicalLeft) {
        const el = this.viewport;
        const maxScroll = this.getMaxScroll();
        const clamped = Math.max(0, Math.min(maxScroll, logicalLeft));

        let target = clamped;

        if (this.isRTL()) {
            const type = this.getRTLScrollType();
            if (type === 'negative') target = -clamped;
            else if (type === 'reverse') target = maxScroll - clamped;
        }

        el.scrollTo({
            left: target,
            behavior: this.prefersReducedMotion ? 'auto' : 'smooth',
        });
    }

    /**
     * Detect the browser's RTL scrollLeft behavior.
     *
     * @returns {"negative"|"reverse"|"default"}
     */
    getRTLScrollType() {
        if (this._rtlScrollType) return this._rtlScrollType;

        // If not RTL, irrelevant.
        if (
            !this.viewport ||
            getComputedStyle(this.viewport).direction !== 'rtl'
        ) {
            this._rtlScrollType = 'default';
            return this._rtlScrollType;
        }

        // Create a probe scroller isolated from scroll-snap and layout effects.
        const probe = document.createElement('div');
        probe.dir = 'rtl';
        probe.style.cssText = [
            'position:absolute',
            'top:-9999px',
            'left:-9999px',
            'width:100px',
            'height:1px',
            'overflow:scroll',
            'scroll-snap-type:none',
            'contain:layout style paint',
            'visibility:hidden',
        ].join(';');

        const inner = document.createElement('div');
        inner.style.width = '200px';
        inner.style.height = '1px';
        probe.appendChild(inner);
        document.body.appendChild(probe);

        try {
            const maxScroll = probe.scrollWidth - probe.clientWidth;

            // 1) Negative model: setting scrollLeft to 1 keeps it at 0 (Chrome/Safari)
            probe.scrollLeft = 0;
            probe.scrollLeft = 1;

            if (probe.scrollLeft === 0) {
                this._rtlScrollType = 'negative';
                return this._rtlScrollType;
            }

            // 2) Distinguish default vs reverse
            probe.scrollLeft = maxScroll;

            this._rtlScrollType =
                probe.scrollLeft === maxScroll ? 'default' : 'reverse';

            return this._rtlScrollType;
        } finally {
            // Always clean up probe element, even if error occurs
            document.body.removeChild(probe);
        }
    }

    /* ---------------------------------------------------------------------
     * Snap navigation helpers
     * ------------------------------------------------------------------ */

    /**
     * Find the nearest snap strictly before the given scroll position.
     *
     * @param {number} pos
     * @returns {number|null}
     */
    getPrevSnapPosition(pos) {
        const eps = this.getEpsilonPx();

        // Iterate from end to find the closest previous snap
        for (let i = this.snapLefts.length - 1; i >= 0; i--) {
            if (this.snapLefts[i] < pos - eps) {
                return this.snapLefts[i];
            }
        }
        return null;
    }

    /**
     * Find the nearest snap strictly after the given scroll position.
     *
     * @param {number} pos
     * @returns {number|null}
     */
    getNextSnapPosition(pos) {
        const eps = this.getEpsilonPx();
        for (let i = 0; i < this.snapLefts.length; i++) {
            if (this.snapLefts[i] > pos + eps) {
                return this.snapLefts[i];
            }
        }
        return null;
    }

    /**
     * Find the snap index whose snapLeft is closest to the given scroll position.
     * Prefers the earliest snap when distances are very close.
     *
     * @param {number} pos
     * @returns {number}
     */
    getClosestSnapIndex(pos) {
        let bestIndex = 0;
        let bestDist = Infinity;
        const eps = this.getEpsilonPx();

        for (let i = 0; i < this.snapLefts.length; i++) {
            const d = Math.abs(this.snapLefts[i] - pos);
            if (d < bestDist - eps) {
                bestDist = d;
                bestIndex = i;
            }
        }
        return bestIndex;
    }

    /* ---------------------------------------------------------------------
     * Boundary & overflow helpers
     * ------------------------------------------------------------------ */

    /**
     * Detect whether the viewport is at the start boundary.
     *
     * @returns {boolean}
     */
    isAtStart() {
        return this.getScrollPosition() <= this.getEpsilonPx();
    }

    /**
     * Detect whether the viewport is at the end boundary.
     *
     * @returns {boolean}
     */
    isAtEnd() {
        return (
            this.getScrollPosition() >=
            this.getMaxScroll() - this.getEpsilonPx()
        );
    }

    /**
     * Detect whether the viewport is horizontally scrollable.
     *
     * @returns {boolean}
     */
    isOverflowing() {
        return (
            this.viewport &&
            this.viewport.scrollWidth - this.viewport.clientWidth > 1
        );
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

        if (this.prevBtn) this.prevBtn.disabled = !overflowing;
        if (this.nextBtn) this.nextBtn.disabled = !overflowing;

        if (this.debug) console.info('[IRNMNCarousel] Overflow:', overflowing);
    }

    /* ---------------------------------------------------------------------
     * Lifecycle
     * ------------------------------------------------------------------ */

    /**
     * Web Component lifecycle: invoked when added to the DOM.
     *
     * @returns {void}
     */
    connectedCallback() {
        if (this.connected) return;
        this.connected = true;

        this._abortController = new AbortController();
        this._signal = this._abortController.signal;

        this.initCarousel();

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
     * Web Component lifecycle: invoked when removed from the DOM.
     *
     * @returns {void}
     */
    disconnectedCallback() {
        // Clean up timers
        if (this._scrollSettledTimer) {
            clearTimeout(this._scrollSettledTimer);
            this._scrollSettledTimer = null;
        }

        // Clean up RAF
        if (this._scrollRafId) {
            cancelAnimationFrame(this._scrollRafId);
            this._scrollRafId = null;
        }

        // Clean up observers and controllers
        this._abortController?.abort();
        this._resizeObserver?.disconnect();

        this.connected = false;

        if (this.debug) console.info('[IRNMNCarousel] Cleaned up');
    }

    /* ---------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------ */

    /**
     * Initialize carousel: query DOM, set ARIA, compute snaps, bind listeners,
     * and perform initial sync once layout has settled.
     *
     * @returns {void}
     */
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

        this._rtlScrollType = null;

        this.slides = Array.from(
            viewport.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        this.prevBtn = this.querySelector(this.CLASSNAMES.PREV_BUTTON);
        this.nextBtn = this.querySelector(this.CLASSNAMES.NEXT_BUTTON);
        this.pagerCurrent = this.querySelector(this.CLASSNAMES.CURRENT_SLIDE);
        this.pagerTotal = this.querySelector(this.CLASSNAMES.TOTAL_SLIDES);

        this.updateTotal();
        this.initSlidesAttributes();

        this.calculateSnapLefts();
        this.syncOverflowState();

        this.addScrollListener();
        this.addControlsListeners();
        this.addKeyboardSupport();
        this.setupResizeObserver();

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
    }

    /**
     * Update pager UI with total slide count and reset current to 1.
     *
     * @returns {void}
     */
    updateTotal() {
        if (this.pagerTotal)
            this.pagerTotal.textContent = String(this.slides.length);
        if (this.pagerCurrent) this.pagerCurrent.textContent = '1';
    }

    /**
     * Initialize ARIA attributes on slides.
     *
     * @returns {void}
     */
    initSlidesAttributes() {
        const total = this.slides.length;
        this.slides.forEach((slide, i) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            if (!slide.hasAttribute('aria-label')) {
                slide.setAttribute('aria-label', `Item ${i + 1} of ${total}`);
            }
            slide.removeAttribute('tabindex');
        });
    }

    /* ---------------------------------------------------------------------
     * Geometry & snap computation
     * ------------------------------------------------------------------ */

    /**
     * Get the scroll-padding-start value of the viewport.
     *
     * @returns {number}
     */
    getScrollPaddingStart() {
        const cs = getComputedStyle(this.viewport);
        return this.isRTL()
            ? parseFloat(cs.scrollPaddingRight) || 0
            : parseFloat(cs.scrollPaddingLeft) || 0;
    }

    /**
     * Calculate snapLeft positions for all slides in normalized scroll space.
     * Uses logical "start" alignment for all slides.
     *
     * @returns {void}
     */
    calculateSnapLefts() {
        const isRTL = this.isRTL();
        const curPos = this.getScrollPosition();
        const eps = this.getEpsilonPx();

        const vpRect = this.viewport.getBoundingClientRect();
        const padStart = this.getScrollPaddingStart();

        const vpStart = isRTL
            ? vpRect.right - padStart
            : vpRect.left + padStart;

        this.snapLefts = this.slides.map((slide) => {
            const r = slide.getBoundingClientRect();
            const slideStart = isRTL ? r.right : r.left;
            const delta = isRTL ? vpStart - slideStart : slideStart - vpStart;

            // IMPORTANT: do NOT clamp to maxScroll here
            const raw = curPos + delta;

            // Keep negatives tidy
            if (Math.abs(raw) < eps) return 0;
            return raw < 0 ? 0 : raw;
        });

        if (this.debug) {
            console.info(
                '[IRNMNCarousel] snapLefts (unclamped)',
                this.snapLefts,
            );
        }
    }

    /* ---------------------------------------------------------------------
     * Scroll handling
     * ------------------------------------------------------------------ */

    /**
     * Setup ResizeObserver to recalculate snap points on resize.
     *
     * @returns {void}
     */
    setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => {
            // Guard against observer firing after disconnect
            if (!this.connected) return;

            this.calculateSnapLefts();
            this.syncOverflowState();
            this.updateActiveFromScroll();
        });
        this._resizeObserver.observe(this.viewport);
    }

    /**
     * Add scroll listener with requestAnimationFrame throttling.
     *
     * @returns {void}
     */
    addScrollListener() {
        const onScroll = () => {
            // Cancel any pending RAF to avoid stacking
            if (this._scrollRafId) return;

            this._scrollRafId = requestAnimationFrame(() => {
                this.updateActiveFromScroll({ announce: false });
                this.scheduleScrollSettled();
                this._scrollRafId = null;
            });
        };

        this.addListener(this.viewport, 'scroll', onScroll, { passive: true });
    }

    /**
     * Schedule a "scroll settled" callback.
     *
     * @returns {void}
     */
    scheduleScrollSettled() {
        if (this._scrollSettledTimer) {
            clearTimeout(this._scrollSettledTimer);
        }

        this._scrollSettledTimer = window.setTimeout(() => {
            this.updateActiveFromScroll({ announce: true });
            this._scrollSettledTimer = null;
        }, this._scrollSettledDelay);
    }

    /* ---------------------------------------------------------------------
     * Active state & announcements
     * ------------------------------------------------------------------ */

    /**
     * Update active index based on current scroll position.
     *
     * @param {{ announce?: boolean }} [opts]
     * @returns {void}
     */
    updateActiveFromScroll({ announce = false } = {}) {
        if (!this.snapLefts.length) return;

        const pos = this.getScrollPosition();
        const maxScroll = this.getMaxScroll();
        const eps = this.getEpsilonPx();

        // When reaching physical scroll end, force last slide active (logical)
        if (pos >= maxScroll - eps) {
            this.setActiveIndex(this.slides.length - 1, { announce });
            this.updateControlsDisabledState();
            return;
        }

        const index = this.getClosestSnapIndex(pos);
        this.setActiveIndex(index, { announce });
        this.updateControlsDisabledState();
    }

    /**
     * Disable prev/next based on physical scroll bounds and overflow.
     *
     * @returns {void}
     */
    updateControlsDisabledState() {
        if (!this.isOverflowing()) {
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
            return;
        }

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
    setActiveIndex(index, { announce = false } = {}) {
        if (index === this.currentIndex) {
            if (announce) this.announceActiveIndex(index);
            return;
        }

        this.currentIndex = index;

        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === index);
        });

        if (this.pagerCurrent)
            this.pagerCurrent.textContent = String(index + 1);

        if (announce) this.announceActiveIndex(index);

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

    /**
     * Announce the given active index via aria-live.
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
     * Controls (buttons & keyboard)
     * ------------------------------------------------------------------ */

    /**
     * Add click listeners to prev/next buttons.
     *
     * @returns {void}
     */
    addControlsListeners() {
        this.addListener(this.prevBtn, 'click', () => {
            const pos = this.getScrollPosition();
            const eps = this.getEpsilonPx();

            // Use a slightly larger pos when at END so we can step back
            const from = this.isAtEnd() ? this.getMaxScroll() + eps * 2 : pos;

            const prevSnap = this.getPrevSnapPosition(from);
            if (prevSnap !== null) {
                this.scrollToLogicalPosition(prevSnap);
            }
        });

        this.addListener(this.nextBtn, 'click', () => {
            const pos = this.getScrollPosition();
            const nextSnap = this.getNextSnapPosition(pos);

            if (nextSnap !== null) {
                this.scrollToLogicalPosition(nextSnap);
                return;
            }

            this.scrollToLogicalPosition(this.getMaxScroll());
        });
    }

    /**
     * Add keyboard navigation support.
     *
     * @returns {void}
     */
    addKeyboardSupport() {
        this.addListener(this.viewport, 'keydown', (e) => {
            if (!this.contains(document.activeElement)) return;

            if (
                document.activeElement &&
                ['INPUT', 'TEXTAREA', 'SELECT'].includes(
                    document.activeElement.tagName,
                )
            )
                return;

            const isRTL = this.isRTL();

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    isRTL ? this.prevBtn?.click() : this.nextBtn?.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    isRTL ? this.nextBtn?.click() : this.prevBtn?.click();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.scrollToLogicalPosition(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.scrollToLogicalPosition(this.getMaxScroll());
                    break;
            }
        });
    }

    /* ---------------------------------------------------------------------
     * Public API
     * ------------------------------------------------------------------ */

    /**
     * Re-scan slides and recompute geometry/state.
     *
     * @returns {void}
     */
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
