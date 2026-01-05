import { describe, it, expect, beforeEach } from '@jest/globals';
import LiveRegionAnnouncer from '../LiveRegionAnnouncer.js';

describe('LiveRegionAnnouncer', () => {
    let host;

    beforeEach(() => {
        document.body.innerHTML = '';
        host = document.createElement('div');
        document.body.appendChild(host);
    });

    it('mounts a live region once', () => {
        const a = new LiveRegionAnnouncer();
        a.mount(host);
        a.mount(host);

        const regions = host.querySelectorAll('[aria-live="polite"]');
        expect(regions.length).toBe(1);
    });

    it('dedupes announcements by key', () => {
        const a = new LiveRegionAnnouncer();
        a.mount(host);

        a.announce('k1', 'Hello');
        const region = host.querySelector('[aria-live="polite"]');
        expect(region.textContent).toBe('Hello');

        a.announce('k1', 'Hello again');
        expect(region.textContent).toBe('Hello'); // unchanged
    });

    it('reset allows same key again', () => {
        const a = new LiveRegionAnnouncer();
        a.mount(host);

        a.announce('k1', 'One');
        a.reset();
        a.announce('k1', 'Two');

        const region = host.querySelector('[aria-live="polite"]');
        expect(region.textContent).toBe('Two');
    });

    it('unmount removes the live region', () => {
        const a = new LiveRegionAnnouncer();
        a.mount(host);
        a.unmount();

        expect(host.querySelector('[aria-live="polite"]')).toBeNull();
    });
});
