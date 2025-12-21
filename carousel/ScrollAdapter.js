/**
 * ScrollAdapter — RTL-safe scroll normalization utilities for a scrollable viewport.
 *
 * Goals:
 * - Provide normalized logical scroll positions (distance from left edge of content)
 * - Provide cross-browser RTL scrollLeft normalization
 * - Expose boundary helpers (start/end/overflow) and geometry helpers (maxScroll/epsilon/gap)
 * - Be usable outside of <irnmn-carousel>
 */
export default class ScrollAdapter {
    /**
     * @param {HTMLElement} viewport - The scrollable viewport element.
     * @param {{
     *   debug?: boolean,
     *   prefersReducedMotion?: () => boolean
     * }} [options]
     */
    constructor(viewport, options = {}) {
        this.viewport = viewport;
        this.debug = Boolean(options.debug);
        this._prefersReducedMotion =
            options.prefersReducedMotion ||
            (() =>
                window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        /**
         * Cached RTL scroll behavior type for the current browser.
         * Types:
         * - "negative": Chrome/Safari (scrollLeft goes negative when scrolling right in RTL)
         * - "reverse": Firefox (scrollLeft=0 at right, scrollLeft=maxScroll at left)
         * - "default": IE/Edge legacy (scrollLeft=0 at left, same as LTR)
         * @type {"negative"|"reverse"|"default"|null}
         */
        this._rtlScrollType = null;
    }

    /* ---------------------------------------------------------------------
     * Geometry helpers
     * ------------------------------------------------------------------ */

    /**
     * Detect whether the viewport is in RTL mode.
     *
     * @returns {boolean}
     */
    isRTL() {
        return getComputedStyle(this.viewport).direction === 'rtl';
    }

    /**
     * Get the maximum scrollLeft value for the viewport (LTR space).
     *
     * @returns {number}
     */
    getMaxScroll() {
        return this.viewport.scrollWidth - this.viewport.clientWidth;
    }

    /**
     * Get the gap size in pixels between slides (from viewport computed styles).
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

    /* ---------------------------------------------------------------------
     * RTL scroll normalization
     * ------------------------------------------------------------------ */

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
            document.body.removeChild(probe);
        }
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
     * @param {{ behavior?: ScrollBehavior }} [opts]
     * @returns {void}
     */
    scrollToLogicalPosition(logicalLeft, opts = {}) {
        const el = this.viewport;
        const maxScroll = this.getMaxScroll();
        const clamped = Math.max(0, Math.min(maxScroll, logicalLeft));

        let target = clamped;

        if (this.isRTL()) {
            const type = this.getRTLScrollType();
            if (type === 'negative') target = -clamped;
            else if (type === 'reverse') target = maxScroll - clamped;
        }

        const behavior =
            opts.behavior || (this._prefersReducedMotion() ? 'auto' : 'smooth');

        el.scrollTo({ left: target, behavior });
    }

    /**
     * Reset the viewport scroll to the logical start (0) without animation.
     * Intended for initialization (Safari scroll-snap restoration quirks).
     *
     * @returns {void}
     */
    resetToStartInstant() {
        this.scrollToLogicalPosition(0, { behavior: 'auto' });
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
     * Reset cached RTL type (useful if direction changes).
     *
     * @returns {void}
     */
    resetCaches() {
        this._rtlScrollType = null;
    }
}
