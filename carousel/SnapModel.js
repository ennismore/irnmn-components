/**
 * SnapModel — snap points + virtual pages computation for <irnmn-carousel>.
 *
 * Goals:
 * - Compute snapLeft positions for variable-width slides in normalized scroll space
 * - Provide prev/next/closest snap helpers
 * - Provide virtual page computation (pages mode) based on "click stops"
 */
export default class SnapModel {
    /**
     * @param {{
     *   viewport: HTMLElement,
     *   getSlides: () => HTMLElement[],
     *   scroll: import('./ScrollAdapter.js').default,
     *   debug?: boolean
     * }} deps
     */
    constructor({ viewport, getSlides, scroll, debug = false }) {
        this.viewport = viewport;
        this.getSlides = getSlides;
        this.scroll = scroll;
        this.debug = Boolean(debug);

        // Computed state
        this.snapLefts = [];
        this.virtualPages = [];
    }

    /**
     * Calculate snapLeft positions for all slides in normalized scroll space.
     * Uses logical "start" alignment for all slides.
     *
     * @returns {number[]}
     */
    calculateSnapLefts() {
        const slides = this.getSlides();
        const isRTL = this.scroll.isRTL();
        const curPos = this.scroll.getScrollPosition();
        const eps = this.scroll.getEpsilonPx();

        const vpRect = this.viewport.getBoundingClientRect();
        const padStart = this.scroll.getScrollPaddingStart();

        const vpStart = isRTL
            ? vpRect.right - padStart
            : vpRect.left + padStart;

        this.snapLefts = slides.map((slide) => {
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

        return this.snapLefts;
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
        const eps = this.scroll.getEpsilonPx();

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
        const eps = this.scroll.getEpsilonPx();
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
        const eps = this.scroll.getEpsilonPx();

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
     * Virtual pages (pagerMode='pages')
     * ------------------------------------------------------------------ */

    /**
     * Calculate virtual pages based on viewport width and navigation clicks needed.
     * A "page" represents what you see after one navigation action (next button click).
     *
     * @param {'slides'|'pages'} pagerMode
     * @returns {Array<{snapPosition: number, slideIndices: number[]}>}
     */
    calculateVirtualPages(pagerMode) {
        if (pagerMode !== 'pages') {
            this.virtualPages = [];
            return this.virtualPages;
        }

        if (!this.snapLefts.length) {
            this.virtualPages = [];
            return this.virtualPages;
        }

        const slides = this.getSlides();
        const maxScroll = this.scroll.getMaxScroll();
        const eps = this.scroll.getEpsilonPx();

        // First page always starts at position 0
        const pages = [
            {
                snapPosition: 0,
                slideIndices: this.getVisibleSlideIndices(0),
            },
        ];

        let currentPos = 0;

        // Simulate navigation clicks to discover all meaningful page stops
        while (currentPos < maxScroll - eps) {
            const nextSnap = this.getNextSnapPosition(currentPos);

            if (nextSnap === null) {
                // No more snaps, add final page at maxScroll if not already there
                if (currentPos < maxScroll - eps) {
                    pages.push({
                        snapPosition: maxScroll,
                        slideIndices: [slides.length - 1],
                    });
                }
                break;
            }

            // Find which slides would be visible at this snap position
            const visibleSlideIndices = this.getVisibleSlideIndices(nextSnap);

            pages.push({
                snapPosition: nextSnap,
                slideIndices: visibleSlideIndices,
            });

            currentPos = nextSnap;
        }

        this.virtualPages = pages;

        if (this.debug) {
            console.info(
                '[IRNMNCarousel] Virtual pages:',
                this.virtualPages.length,
                this.virtualPages,
            );
            console.info(
                '[IRNMNCarousel] Viewport width:',
                this.viewport.clientWidth,
            );
            console.info('[IRNMNCarousel] Max scroll:', maxScroll);
        }

        return this.virtualPages;
    }

    /**
     * Get indices of slides that are visible (at least partially) at a given scroll position.
     *
     * @param {number} scrollPos - Normalized scroll position
     * @returns {number[]}
     */
    getVisibleSlideIndices(scrollPos) {
        const slides = this.getSlides();
        const eps = this.scroll.getEpsilonPx();

        // Current viewport geometry in pixels
        const vpRect = this.viewport.getBoundingClientRect();
        const vpStartPx = vpRect.left;
        const vpEndPx = vpRect.right;

        // How much would content shift if we were at scrollPos?
        // (in logical LTR space)
        const curPos = this.scroll.getScrollPosition();
        const dx = scrollPos - curPos;

        const indices = [];

        slides.forEach((slide, i) => {
            const r = slide.getBoundingClientRect();

            // Predict the slide rect at scrollPos by shifting horizontally
            const predictedLeft = r.left - dx;
            const predictedRight = r.right - dx;

            // Overlap test with viewport
            if (
                predictedRight > vpStartPx + eps &&
                predictedLeft < vpEndPx - eps
            ) {
                indices.push(i);
            }
        });

        return indices;
    }
}
