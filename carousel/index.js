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
    eventListeners = [];

    slides = [];
    snapLefts = [];
    currentIndex = 0;

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

    get prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    addListener(element, event, handler, options) {
        if (!element) return;
        element.addEventListener(event, handler, options);
        this.eventListeners.push({ element, event, handler, options });
    }

    getScrollPaddingLeft() {
        const cs = getComputedStyle(this.viewport);
        return parseFloat(cs.scrollPaddingLeft) || 0;
    }

    getGapPx() {
        const cs = getComputedStyle(this.viewport);
        return parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
    }

    getEpsilonPx() {
        // small tolerance for rounding / snap settling
        const epsFromGap = this.getGapPx() / 2;
        return Math.max(2, Math.min(12, epsFromGap || 6));
    }

    getMaxScroll() {
        return this.viewport.scrollWidth - this.viewport.clientWidth;
    }

    isAtStart() {
        return this.viewport.scrollLeft <= this.getEpsilonPx();
    }

    isAtEnd() {
        return (
            this.viewport.scrollLeft >=
            this.getMaxScroll() - this.getEpsilonPx()
        );
    }

    /* ---------------------------------------------------------------------
     * Lifecycle
     * ------------------------------------------------------------------ */

    connectedCallback() {
        if (this.connected) return;
        this.connected = true;

        this.initCarousel();

        // aria-live (optional)
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
        this.eventListeners.forEach(({ element, event, handler, options }) => {
            element.removeEventListener(event, handler, options);
        });
        this.eventListeners = [];
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

        this.addScrollListener();
        this.addControlsListeners();
        this.addKeyboardSupport();
        this.setupResizeObserver();

        // Initial sync after layout settles
        requestAnimationFrame(() => {
            this.calculateSnapLefts();
            this.updateActiveFromScroll();
        });

        window.addEventListener(
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
            slide.setAttribute('aria-label', `Item ${i + 1} of ${total}`);
            slide.setAttribute('tabindex', i === 0 ? '0' : '-1');
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

    setupResizeObserver() {
        this._resizeObserver = new ResizeObserver(() => {
            this.calculateSnapLefts();
            this.updateActiveFromScroll();
        });
        this._resizeObserver.observe(this.viewport);
    }

    addScrollListener() {
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                this.updateActiveFromScroll();
                ticking = false;
            });
        };

        this.addListener(this.viewport, 'scroll', onScroll, { passive: true });
    }

    updateActiveFromScroll() {
        const pos = this.viewport.scrollLeft;

        if (!this.snapLefts.length) return;

        // When reaching scroll end, force last slide as active (logical)
        if (this.isAtEnd()) {
            this.setActiveIndex(this.slides.length - 1);
            this.updateControlsDisabledState();
            return;
        }

        // Otherwise: closest snap point
        let bestIndex = 0;
        let bestDist = Infinity;

        for (let i = 0; i < this.snapLefts.length; i++) {
            const d = Math.abs(this.snapLefts[i] - pos);
            if (d < bestDist) {
                bestDist = d;
                bestIndex = i;
            }
        }

        this.setActiveIndex(bestIndex);
        this.updateControlsDisabledState();
    }

    updateControlsDisabledState() {
        // Important: disable based on physical scroll limits, not logical index.
        if (this.prevBtn) this.prevBtn.disabled = this.isAtStart();
        if (this.nextBtn) this.nextBtn.disabled = this.isAtEnd();
    }

    setActiveIndex(index) {
        if (index === this.currentIndex) return;

        this.currentIndex = index;

        this.slides.forEach((slide, i) => {
            slide.setAttribute('tabindex', i === index ? '0' : '-1');
            slide.classList.toggle('active-slide', i === index);
        });

        if (this.pagerCurrent)
            this.pagerCurrent.textContent = String(index + 1);

        if (this.ariaLiveRegion) {
            this.ariaLiveRegion.textContent = `Item ${index + 1} of ${this.slides.length}`;
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

    addKeyboardSupport() {
        this.addListener(this.viewport, 'keydown', (e) => {
            if (!this.contains(document.activeElement)) return;

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
