import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import ScrollAdapter from '../ScrollAdapter.js';

function makeViewport() {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 300, configurable: true });
    el.scrollLeft = 0;
    el.scrollTo = jest.fn(({ left }) => {
        el.scrollLeft = left;
    });
    return el;
}

describe('ScrollAdapter', () => {
    let viewport;
    let _origGetComputedStyle;
    let _origMatchMedia;

    beforeEach(() => {
        viewport = makeViewport();
        document.body.appendChild(viewport);

        _origGetComputedStyle = global.getComputedStyle;
        _origMatchMedia = global.matchMedia;

        // Default stable style + media for tests that don't override it
        global.getComputedStyle = () => ({
            direction: 'ltr',
            columnGap: '0px',
            gap: '0px',
            scrollPaddingLeft: '0px',
            scrollPaddingRight: '0px',
        });

        global.matchMedia = () => ({ matches: false });
    });

    afterEach(() => {
        viewport.remove();
        global.getComputedStyle = _origGetComputedStyle;
        global.matchMedia = _origMatchMedia;
    });

    it('getMaxScroll returns scrollWidth - clientWidth', () => {
        const s = new ScrollAdapter(viewport);
        expect(s.getMaxScroll()).toBe(200);
    });

    it('scrollToLogicalPosition clamps within bounds (LTR)', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => true });
        jest.spyOn(s, 'isRTL').mockReturnValue(false);

        s.scrollToLogicalPosition(999);
        expect(viewport.scrollLeft).toBe(200);

        s.scrollToLogicalPosition(-50);
        expect(viewport.scrollLeft).toBe(0);
    });

    it('isAtStart / isAtEnd use epsilon (LTR)', () => {
        const s = new ScrollAdapter(viewport);
        jest.spyOn(s, 'isRTL').mockReturnValue(false);
        jest.spyOn(s, 'getEpsilonPx').mockReturnValue(5);

        viewport.scrollLeft = 0;
        expect(s.isAtStart()).toBe(true);

        viewport.scrollLeft = 200;
        expect(s.isAtEnd()).toBe(true);
    });

    it('scrollToLogicalPosition uses auto when prefersReducedMotion=true', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => true });
        jest.spyOn(s, 'isRTL').mockReturnValue(false);

        s.scrollToLogicalPosition(50);
        expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 50, behavior: 'auto' });
    });

    it('scrollToLogicalPosition uses smooth when prefersReducedMotion=false', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => false });
        jest.spyOn(s, 'isRTL').mockReturnValue(false);

        s.scrollToLogicalPosition(50);
        expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 50, behavior: 'smooth' });
    });

    it('scrollToLogicalPosition honors explicit behavior override', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => false });
        jest.spyOn(s, 'isRTL').mockReturnValue(false);

        s.scrollToLogicalPosition(50, { behavior: 'auto' });
        expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 50, behavior: 'auto' });
    });

    it('isOverflowing is false when scrollWidth-clientWidth <= 1', () => {
        Object.defineProperty(viewport, 'scrollWidth', { value: 101, configurable: true }); // 101-100=1
        const s = new ScrollAdapter(viewport);
        expect(s.isOverflowing()).toBe(false);
    });

    it('isOverflowing is true when scrollWidth-clientWidth > 1', () => {
        Object.defineProperty(viewport, 'scrollWidth', { value: 102, configurable: true }); // 2
        const s = new ScrollAdapter(viewport);
        expect(s.isOverflowing()).toBe(true);
    });

    it('getGapPx reads columnGap first, then gap', () => {
        global.getComputedStyle = () => ({
            direction: 'ltr',
            columnGap: '12px',
            gap: '99px',
            scrollPaddingLeft: '0px',
            scrollPaddingRight: '0px',
        });

        const s = new ScrollAdapter(viewport);
        expect(s.getGapPx()).toBe(12);

        global.getComputedStyle = () => ({
            direction: 'ltr',
            columnGap: '',
            gap: '8px',
            scrollPaddingLeft: '0px',
            scrollPaddingRight: '0px',
        });

        expect(s.getGapPx()).toBe(8);
    });

    it('getEpsilonPx clamps between 2 and 12, with fallback 6', () => {
        const s = new ScrollAdapter(viewport);

        jest.spyOn(s, 'getGapPx').mockReturnValue(0);
        expect(s.getEpsilonPx()).toBe(6);

        s.getGapPx.mockReturnValue(2); // gap/2=1 -> clamp to 2
        expect(s.getEpsilonPx()).toBe(2);

        s.getGapPx.mockReturnValue(40); // gap/2=20 -> clamp to 12
        expect(s.getEpsilonPx()).toBe(12);
    });

    it('getScrollPaddingStart uses scrollPaddingLeft in LTR', () => {
        global.getComputedStyle = () => ({
            direction: 'ltr',
            columnGap: '0px',
            gap: '0px',
            scrollPaddingLeft: '15px',
            scrollPaddingRight: '99px',
        });

        const s = new ScrollAdapter(viewport);
        expect(s.getScrollPaddingStart()).toBe(15);
    });

    it('getScrollPaddingStart uses scrollPaddingRight in RTL', () => {
        global.getComputedStyle = () => ({
            direction: 'rtl',
            columnGap: '0px',
            gap: '0px',
            scrollPaddingLeft: '99px',
            scrollPaddingRight: '12px',
        });

        const s = new ScrollAdapter(viewport);
        expect(s.getScrollPaddingStart()).toBe(12);
    });

    it('getScrollPosition maps correctly in RTL negative model', () => {
        const s = new ScrollAdapter(viewport);
        jest.spyOn(s, 'isRTL').mockReturnValue(true);
        jest.spyOn(s, 'getRTLScrollType').mockReturnValue('negative');

        viewport.scrollLeft = -30;
        expect(s.getScrollPosition()).toBe(30);
    });

    it('scrollToLogicalPosition maps correctly in RTL reverse model', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => true });
        jest.spyOn(s, 'isRTL').mockReturnValue(true);
        jest.spyOn(s, 'getRTLScrollType').mockReturnValue('reverse');

        // maxScroll = 200, logical 50 => raw should be maxScroll - 50 = 150
        s.scrollToLogicalPosition(50);
        expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 150, behavior: 'auto' });
    });

    it('resetToStartInstant scrolls to 0 with behavior auto', () => {
        const s = new ScrollAdapter(viewport, { prefersReducedMotion: () => false });
        jest.spyOn(s, 'isRTL').mockReturnValue(false);

        s.resetToStartInstant();
        expect(viewport.scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'auto' });
    });

    it('resetCaches clears cached RTL type', () => {
        const s = new ScrollAdapter(viewport);
        s._rtlScrollType = 'negative';
        s.resetCaches();
        expect(s._rtlScrollType).toBe(null);
    });
});
