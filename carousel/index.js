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

import ScrollAdapter from './ScrollAdapter.js';
import SnapModel from './SnapModel.js';
import LiveRegionAnnouncer from './LiveRegionAnnouncer.js';

class IRNMNCarousel extends HTMLElement {
    /* ---------------------------------------------------------------------
     * State & configuration
     * ------------------------------------------------------------------ */

    CLASSNAMES = [];

    // Carousel elements
    slides = [];
    currentIndex = -1;
    currentPageIndex = -1;
    viewport = null;
    prevBtn = null;
    nextBtn = null;
    pagerCurrent = null;
    pagerTotal = null;

    // Helpers
    scroll = null; // ScrollAdapter
    snap = null; // SnapModel
    announcer = null; // LiveRegionAnnouncer

    // Debug flag
    debug = false;

    /**
     * Pager mode:
     * - 'slides' → slide-based indexing
     * - 'pages'  → virtual pages indexing
     */
    pagerMode = 'pages';

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
     * MutationObserver for dynamic slide changes
     * @type {MutationObserver|null}
     */
    _mutationObserver = null;

    /**
     * Scroll-settle timer id.
     * @type {number|null}
     */
    _scrollSettledTimer = null;

    /**
     * Scroll-settle debounce duration in ms.
     */
    _scrollSettledDelay = 120;

    /**
     * requestAnimationFrame id for scroll throttling.
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

        const urlParams = new URLSearchParams(window.location.search);
        this.debug = urlParams.has('debugCarousel');

        if (this.debug) {
            console.info('[IRNMNCarousel] Constructor', this.CLASSNAMES);
        }
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
        const classnames = {};

        try {
            selectors = selectors ? JSON.parse(selectors) : {};
        } catch (error) {
            console.error('[IRNMNCarousel] Error parsing selectors:', error);
            return classnames;
        }

        for (const key in selectors) {
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
     * @param {AddEventListenerOptions} [options]
     */
    addListener(element, event, handler, options = {}) {
        if (!element) return;
        element.addEventListener(event, handler, {
            ...options,
            signal: this._signal,
        });
    }

    /* ---------------------------------------------------------------------
     * Lifecycle
     * ------------------------------------------------------------------ */

    connectedCallback() {
        if (this.connected) return;

        this._abortController = new AbortController();
        this._signal = this._abortController.signal;

        this.CLASSNAMES = this.selectors;

        const ok = this.initCarousel(); // return boolean
        this.connected = ok;
    }

    disconnectedCallback() {
        // Clean up timers
        if (this._scrollSettledTimer) {
            clearTimeout(this._scrollSettledTimer);
        }

        // Clean up RAF
        if (this._scrollRafId) {
            cancelAnimationFrame(this._scrollRafId);
        }

        // Unmount live region
        this.announcer?.unmount();

        // Clean up observers and controllers
        this._abortController?.abort();
        this._resizeObserver?.disconnect();
        this._mutationObserver?.disconnect();

        this.connected = false;

        if (this.debug) {
            console.info('[IRNMNCarousel] Cleaned up');
        }
    }

    static get observedAttributes() {
        return ['selectors', 'pager-mode'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'selectors') {
            this.CLASSNAMES = this.selectors;

            // If already initialized, re-bind or refresh safely
            if (this.connected && this.viewport) {
                this.refresh?.();
            }
        }

        if (name === 'pager-mode') {
            if (newValue === 'slides' || newValue === 'pages') {
                this.pagerMode = newValue;
                if (this.connected && this.viewport) {
                    this.refresh?.();
                }
            }
        }
    }

    /* ---------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------ */

    /**
     * Initialize carousel
     *
     * @returns {void}
     */
    initCarousel() {
        // Find viewport element from DOM ( early exit if not found )
        const viewport = this.querySelector(this.CLASSNAMES.VIEWPORT);
        if (!viewport) {
            console.error('[IRNMNCarousel] Viewport not found');
            return false;
        }

        // Main viewport element + A11y attributes
        this.viewport = viewport;
        this.viewport.setAttribute('tabindex', '0');
        this.viewport.setAttribute('role', 'region');
        this.viewport.setAttribute('aria-roledescription', 'carousel');

        // Helpers
        this.scroll = new ScrollAdapter(this.viewport, {
            debug: this.debug,
            prefersReducedMotion: () => this.prefersReducedMotion,
        });

        // Snap model
        this.snap = new SnapModel({
            viewport: this.viewport,
            getSlides: () => this.slides,
            scroll: this.scroll,
            debug: this.debug,
        });

        // Live region announcer
        this.announcer = new LiveRegionAnnouncer();
        this.announcer.mount(this);

        // Pager mode
        const modeAttr = this.getAttribute('pager-mode');
        if (modeAttr === 'slides' || modeAttr === 'pages') {
            this.pagerMode = modeAttr;
        }

        // List of slides
        this.slides = Array.from(
            viewport.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        // Controls & pager elements
        this.prevBtn = this.querySelector(this.CLASSNAMES.PREV_BUTTON);
        this.nextBtn = this.querySelector(this.CLASSNAMES.NEXT_BUTTON);
        this.pagerCurrent = this.querySelector(this.CLASSNAMES.CURRENT_SLIDE);
        this.pagerTotal = this.querySelector(this.CLASSNAMES.TOTAL_SLIDES);

        this.initSlidesAttributes();

        this.snap.calculateSnapLefts();
        this.snap.calculateVirtualPages(this.pagerMode);
        this.updateTotal();
        this.syncOverflowState();

        this.addScrollListener();
        this.addControlsListeners();
        this.addKeyboardSupport();
        this.setupResizeObserver();
        this.setupMutationObserver();

        // Safari snap restoration fix (force scrollLeft=0 on init)
        this.scroll.resetToStartInstant();

        // Initial active slide/page
        requestAnimationFrame(() => {
            this.snap.calculateSnapLefts();
            this.snap.calculateVirtualPages(this.pagerMode);
            this.updateTotal();
            this.syncOverflowState();
            this.updateActiveFromScroll();
        });

        return true;
    }

    /* ---------------------------------------------------------------------
     * Slides & pager
     * ------------------------------------------------------------------ */

    /**
     * Initialize slides attributes for A11y.
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

    /**
     * Update total slides/pages in pager display.
     */
    updateTotal() {
        if (!this.pagerTotal) return;

        if (this.pagerMode === 'pages') {
            this.pagerTotal.textContent = String(
                this.snap?.virtualPages?.length || 1,
            );
        } else {
            this.pagerTotal.textContent = String(this.slides.length);
        }
    }

    /* ---------------------------------------------------------------------
     * Scroll & active state
     * ------------------------------------------------------------------ */

    /**
     * Update active slide/page from current scroll position.
     *
     * @param {*} options
     */
    updateActiveFromScroll({ announce = false } = {}) {
        if (!this.snap?.snapLefts?.length) return;

        const pos = this.scroll.getScrollPosition();
        const maxScroll = this.scroll.getMaxScroll();
        const eps = this.scroll.getEpsilonPx();

        // Handle pages mode
        if (this.pagerMode === 'pages') {
            this.updateActivePageFromScroll({ announce });

            // Keep "last slide active at physical end" behavior in pages mode too
            const slideIndex =
                pos >= maxScroll - eps
                    ? this.slides.length - 1
                    : this.snap.getClosestSnapIndex(pos);

            // Apply active-slide class without messing with page pagerCurrent
            this.setActiveIndex(slideIndex, {
                announce: false,
                updatePager: false,
            });

            this.updateControlsDisabledState();
            return;
        }

        // When reaching physical scroll end, force last slide active (logical)
        if (pos >= maxScroll - eps) {
            this.setActiveIndex(this.slides.length - 1, { announce });
            this.updateControlsDisabledState();
            return;
        }

        const index = this.snap.getClosestSnapIndex(pos);
        this.setActiveIndex(index, { announce });
        this.updateControlsDisabledState();
    }

    /**
     * Set the active slide index.
     *
     * @param {number} index
     * @param {*} options
     */
    setActiveIndex(index, { announce = false, updatePager = true } = {}) {
        if (index === this.currentIndex) {
            if (announce) {
                this.announcer.announceSlide(index, this.slides.length);
            }
            return;
        }

        this.currentIndex = index;

        this.slides.forEach((slide, i) => {
            slide.classList.toggle('active-slide', i === index);
        });

        // Only update pagerCurrent when in "slides" mode (or when explicitly allowed)
        if (updatePager && this.pagerCurrent) {
            this.pagerCurrent.textContent = String(index + 1);
        }

        if (announce) {
            this.announcer.announceSlide(index, this.slides.length);
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
    }

    /**
     * Update active page index from scroll position.
     *
     * @param {*} options
     */
    updateActivePageFromScroll({ announce = false } = {}) {
        if (this.pagerMode !== 'pages' || !this.snap?.virtualPages?.length)
            return;
        const pos = this.scroll.getScrollPosition();
        const maxScroll = this.scroll.getMaxScroll();
        const eps = this.scroll.getEpsilonPx();

        if (pos >= maxScroll - eps) {
            this.setActivePageIndex(this.snap.virtualPages.length - 1, {
                announce,
            });
            return;
        }

        let closestIndex = 0;
        let closestDist = Infinity;

        this.snap.virtualPages.forEach((page, i) => {
            const dist = Math.abs(page.snapPosition - pos);
            if (dist < closestDist) {
                closestDist = dist;
                closestIndex = i;
            }
        });

        this.setActivePageIndex(closestIndex, { announce });
    }

    /**
     * Set the active page index.
     *
     * @param {*} pageIndex
     * @param {*} options
     */
    setActivePageIndex(pageIndex, { announce = false } = {}) {
        if (pageIndex === this.currentPageIndex) {
            if (announce) {
                this.announcer.announcePage(
                    pageIndex,
                    this.snap.virtualPages.length,
                );
            }
            return;
        }

        this.currentPageIndex = pageIndex;

        if (this.pagerCurrent) {
            this.pagerCurrent.textContent = String(pageIndex + 1);
        }

        if (announce) {
            this.announcer.announcePage(
                pageIndex,
                this.snap.virtualPages.length,
            );
        }
    }

    /* ---------------------------------------------------------------------
     * Controls Methods ( + buttons & keyboard listeners )
     * ------------------------------------------------------------------ */

    goPrev() {
        const pos = this.scroll.getScrollPosition();
        const eps = this.scroll.getEpsilonPx();

        const from = this.scroll.isAtEnd()
            ? this.scroll.getMaxScroll() + eps * 2
            : pos;

        const prevSnap = this.snap.getPrevSnapPosition(from);
        if (prevSnap !== null) {
            this.scroll.scrollToLogicalPosition(prevSnap);
        }
    }

    goNext() {
        const pos = this.scroll.getScrollPosition();
        const nextSnap = this.snap.getNextSnapPosition(pos);

        if (nextSnap !== null) {
            this.scroll.scrollToLogicalPosition(nextSnap);
            return;
        }

        this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll());
    }

    goFirst() {
        this.scroll.scrollToLogicalPosition(0);
    }

    goLast() {
        this.scroll.scrollToLogicalPosition(this.scroll.getMaxScroll());
    }

    /**
     * Add click listeners to prev/next buttons.
     */
    addControlsListeners() {
        this.addListener(this.prevBtn, 'click', () => this.goPrev());
        this.addListener(this.nextBtn, 'click', () => this.goNext());
    }

    /**
     * Add keyboard navigation support (ArrowLeft/ArrowRight/Home/End).
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
            const isRTL = this.scroll.isRTL();

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    isRTL ? this.goPrev() : this.goNext();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    isRTL ? this.goNext() : this.goPrev();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goFirst();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goLast();
                    break;
            }
        });
    }

    /**
     * Update disabled state of prev/next buttons.
     * No scroll → both disabled
     * At start → prev disabled
     * At end → next disabled
     */
    updateControlsDisabledState() {
        if (!this.scroll?.isOverflowing()) {
            if (this.prevBtn) this.prevBtn.disabled = true;
            if (this.nextBtn) this.nextBtn.disabled = true;
            return;
        }

        if (this.prevBtn) this.prevBtn.disabled = this.scroll.isAtStart();
        if (this.nextBtn) this.nextBtn.disabled = this.scroll.isAtEnd();
    }

    /* ---------------------------------------------------------------------
     * Observers & utilities
     * ------------------------------------------------------------------ */

    /**
     * Sync overflow state (is-overflowing class + buttons disabled state).
     */
    syncOverflowState() {
        const overflowing = this.scroll.isOverflowing();
        this.classList.toggle('is-overflowing', overflowing);

        if (this.prevBtn) this.prevBtn.disabled = !overflowing;
        if (this.nextBtn) this.nextBtn.disabled = !overflowing;
    }

    /**
     * Setup ResizeObserver on viewport to recalculate snaps on resize.
     */
    setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => {
            if (!this.connected) return;

            this.refresh();
        });

        this._resizeObserver.observe(this.viewport);
    }

    /**
     * Setup MutationObserver on viewport to detect slide changes.
     */
    setupMutationObserver() {
        if (!this.viewport) return;

        this._mutationObserver = new MutationObserver((mutations) => {
            let shouldRefresh = false;

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // Check added nodes
                    mutation.addedNodes.forEach((node) => {
                        if (
                            node.nodeType === 1 &&
                            node.matches?.(this.CLASSNAMES.SLIDES)
                        ) {
                            shouldRefresh = true;
                        }
                    });

                    // Check removed nodes
                    mutation.removedNodes.forEach((node) => {
                        if (
                            node.nodeType === 1 &&
                            node.matches?.(this.CLASSNAMES.SLIDES)
                        ) {
                            shouldRefresh = true;
                        }
                    });
                }
            }

            if (shouldRefresh) {
                if (this.debug) {
                    console.info('[IRNMNCarousel] Slides changed – refreshing');
                }
                this.refresh();
            }
        });

        this._mutationObserver.observe(this.viewport, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Add scroll listener with RAF throttling.
     */
    addScrollListener() {
        this.addListener(
            this.viewport,
            'scroll',
            () => {
                if (this._scrollRafId) return;

                this._scrollRafId = requestAnimationFrame(() => {
                    this.updateActiveFromScroll({ announce: false });
                    this.scheduleScrollSettled();
                    this._scrollRafId = null;
                });
            },
            { passive: true },
        );
    }

    /**
     * Schedule scroll-settled update with debounce.
     */
    scheduleScrollSettled() {
        clearTimeout(this._scrollSettledTimer);
        this._scrollSettledTimer = setTimeout(() => {
            this.updateActiveFromScroll({ announce: true });
        }, this._scrollSettledDelay);
    }

    /* ---------------------------------------------------------------------
     * Public API
     * ------------------------------------------------------------------ */

    refresh() {
        this.slides = Array.from(
            this.viewport.querySelectorAll(this.CLASSNAMES.SLIDES),
        );

        this.snap.calculateSnapLefts();
        this.snap.calculateVirtualPages(this.pagerMode);
        this.updateTotal();
        this.syncOverflowState();
        this.updateActiveFromScroll();
        this.announcer?.reset();
    }

    next() {
        this.goNext();
    }

    prev() {
        this.goPrev();
    }
}

if (!customElements.get('irnmn-carousel')) {
    customElements.define('irnmn-carousel', IRNMNCarousel);
}

export default IRNMNCarousel;
