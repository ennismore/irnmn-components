import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import SnapModel from '../SnapModel.js';

function makeModel({ snapLefts = [0, 100, 220], eps = 2, maxScroll = 220 } = {}) {
    const scroll = {
        getEpsilonPx: () => eps,
        getMaxScroll: () => maxScroll,
    };

    const m = new SnapModel({
        viewport: document.createElement('div'),
        getSlides: () => [],
        scroll,
        debug: false,
    });

    m.snapLefts = snapLefts.slice();
    return { m, scroll };
}

describe('SnapModel snap helpers', () => {
    it('getPrevSnapPosition uses strict "< pos - eps"', () => {
        const { m } = makeModel({ snapLefts: [0, 100, 220], eps: 2 });

        // pos=100 => prev must be < 98 => 0
        expect(m.getPrevSnapPosition(100)).toBe(0);

        // pos=101 => prev must be < 99 => 0 (100 is too close)
        expect(m.getPrevSnapPosition(101)).toBe(0);

        // pos=103 => prev must be < 101 => 100
        expect(m.getPrevSnapPosition(103)).toBe(100);
    });

    it('getPrevSnapPosition returns null if none exists', () => {
        const { m } = makeModel({ snapLefts: [0, 100, 220], eps: 2 });
        expect(m.getPrevSnapPosition(1)).toBe(null); // 0 is not < (1-2)
    });

    it('getNextSnapPosition uses strict "> pos + eps"', () => {
        const { m } = makeModel({ snapLefts: [0, 100, 220], eps: 2 });

        // pos=100 => next must be > 102 => 220
        expect(m.getNextSnapPosition(100)).toBe(220);

        // pos=218 => next must be > 220 => null (220 is not > 220)
        expect(m.getNextSnapPosition(218)).toBe(null);

        // pos=217 => next must be > 219 => 220
        expect(m.getNextSnapPosition(217)).toBe(220);
    });

    it('getNextSnapPosition returns null if none exists', () => {
        const { m } = makeModel({ snapLefts: [0, 100], eps: 2 });
        expect(m.getNextSnapPosition(100)).toBe(null); // need > 102
    });

    it('getClosestSnapIndex picks the closest snap; ties keep earliest', () => {
        const { m } = makeModel({ snapLefts: [0, 100, 220], eps: 2 });

        expect(m.getClosestSnapIndex(110)).toBe(1);

        // Exactly midway between 100 and 220 -> 160
        // With eps=2, it should not flip on tiny differences; earliest remains 1.
        expect(m.getClosestSnapIndex(160)).toBe(1);
    });

    it('getClosestSnapIndex favors earlier snap when distances are close within epsilon', () => {
        // Two snaps close to each other; position slightly closer to the second,
        // but within epsilon threshold, it should keep the earlier.
        const { m } = makeModel({ snapLefts: [0, 100, 104], eps: 5 });

        // pos=103: dist to 100 is 3, dist to 104 is 1 -> difference 2 < eps(5)
        // Expect it to keep 100 (index 1)
        expect(m.getClosestSnapIndex(103)).toBe(1);
    });
});

describe('SnapModel virtual pages', () => {
    let m;

    beforeEach(() => {
        ({ m } = makeModel({ snapLefts: [0, 80, 160], eps: 2, maxScroll: 200 }));
        // Avoid DOM/boundingClientRect complexity: stub visibility computation
        jest.spyOn(m, 'getVisibleSlideIndices').mockImplementation((pos) => {
            if (pos === 0) return [0, 1];
            if (pos === 80) return [1, 2];
            if (pos === 160) return [2];
            return [];
        });
        // getSlides is used only for "fallback last slide index" in the maxScroll page
        m.getSlides = () => [{}, {}, {}];
    });

    it('calculateVirtualPages returns [] when pagerMode is not pages', () => {
        const pages = m.calculateVirtualPages('slides');
        expect(pages).toEqual([]);
        expect(m.virtualPages).toEqual([]);
    });

    it('calculateVirtualPages always starts with page at 0', () => {
        const pages = m.calculateVirtualPages('pages');
        expect(pages[0].snapPosition).toBe(0);
        expect(pages[0].slideIndices).toEqual([0, 1]);
    });

    it('calculateVirtualPages walks next snaps until end and includes maxScroll when needed', () => {
        const pages = m.calculateVirtualPages('pages');

        // Expected stops:
        // - 0 (seed)
        // - 80
        // - 160
        // then next snap from 160 is null, so it should add maxScroll=200
        expect(pages.map((p) => p.snapPosition)).toEqual([0, 80, 160, 200]);

        expect(pages[1].slideIndices).toEqual([1, 2]);
        expect(pages[2].slideIndices).toEqual([2]);

        // maxScroll page uses fallback [lastSlideIndex]
        expect(pages[3].slideIndices).toEqual([2]);
    });

    it('calculateVirtualPages returns [] if snapLefts is empty', () => {
        ({ m } = makeModel({ snapLefts: [], eps: 2, maxScroll: 200 }));
        jest.spyOn(m, 'getVisibleSlideIndices').mockImplementation(() => []);
        m.getSlides = () => [];

        const pages = m.calculateVirtualPages('pages');
        expect(pages).toEqual([]);
        expect(m.virtualPages).toEqual([]);
    });
});
