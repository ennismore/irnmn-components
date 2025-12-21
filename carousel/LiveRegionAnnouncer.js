/**
 * LiveRegionAnnouncer — aria-live helper for polite announcements
 *
 * Responsibilities:
 * - Create and mount a visually hidden aria-live region
 * - Deduplicate announcements (avoid repeating the same message)
 * - Provide simple APIs to announce "slide" or "page" changes
 */

class LiveRegionAnnouncer {
    /**
     * Host element where the live region will be appended.
     * @type {HTMLElement|null}
     */
    host = null;

    /**
     * The aria-live DOM node.
     * @type {HTMLDivElement|null}
     */
    ariaLiveRegion = null;

    /**
     * Last key that was announced (used for dedupe).
     * Used to avoid repeating the same announcement.
     * @type {string|null}
     */
    _lastAnnouncedKey = null;

    /**
     * Mount the live region into the given host.
     *
     * @param {HTMLElement} host
     * @returns {void}
     */
    mount(host) {
        if (!host) return;
        this.host = host;

        // Avoid double-mount
        if (this.ariaLiveRegion && this.host.contains(this.ariaLiveRegion)) return;

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

        this.host.appendChild(this.ariaLiveRegion);
    }

    /**
     * Unmount the live region (if mounted).
     *
     * @returns {void}
     */
    unmount() {
        if (this.host && this.ariaLiveRegion && this.host.contains(this.ariaLiveRegion)) {
            this.host.removeChild(this.ariaLiveRegion);
        }

        this.ariaLiveRegion = null;
        this.host = null;
        this._lastAnnouncedKey = null;
    }

    /**
     * Reset deduplication state (so the next announcement is not filtered).
     *
     * @returns {void}
     */
    reset() {
        this._lastAnnouncedKey = null;
    }

    /**
     * Announce a raw message (deduped by key).
     *
     * @param {string} key - stable key used for deduping (e.g. "slide:3/10")
     * @param {string} message
     * @returns {void}
     */
    announce(key, message) {
        if (!this.ariaLiveRegion) return;
        if (this._lastAnnouncedKey === key) return;
        this._lastAnnouncedKey = key;

        this.ariaLiveRegion.textContent = message;
    }

    /**
     * Announce a slide index (1-based for users).
     *
     * @param {number} indexZeroBased
     * @param {number} total
     * @returns {void}
     */
    announceSlide(indexZeroBased, total) {
        const idx = indexZeroBased + 1;
        this.announce(`slide:${idx}/${total}`, `Item ${idx} of ${total}`);
    }

    /**
     * Announce a page index (1-based for users).
     *
     * @param {number} pageIndexZeroBased
     * @param {number} totalPages
     * @returns {void}
     */
    announcePage(pageIndexZeroBased, totalPages) {
        const idx = pageIndexZeroBased + 1;
        this.announce(`page:${idx}/${totalPages}`, `Page ${idx} of ${totalPages}`);
    }
}

export default LiveRegionAnnouncer;
