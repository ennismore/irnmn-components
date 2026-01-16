import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {html} from "lit";
import '../carousel/index.js';
import readme from '../carousel/readme.md?raw';
import '../carousel/style.css';

const meta: Meta = {
    title: 'Components/Carousel',
    tags: ['autodocs'],
    component: 'irnmn-carousel',
    parameters: {
            docs: {
                description: {
                component: readme,
                },
            },
        },
    render: () => {
        return html`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <!-- Scroll-snap viewport -->
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

        </div>

        <!-- Desktop navigation arrows -->
        <button
            type="button"
            class="c-carousel__nav c-carousel__nav--prev"
        >
            ‹
        </button>

        <button
            type="button"
            class="c-carousel__nav c-carousel__nav--next"
        >
            ›
        </button>

        <!-- Mobile pagination -->
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        `;
    }
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RTL: Story = {
    render: () => html`
        <div dir="rtl">
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>

        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>

        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        </div>
    `
};


export const FewSlides: Story = {
    render: () => {
        return html`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">2</span>
        </div>
        </irnmn-carousel>
        `;
    }
};

export const NoControls: Story = {
    render: () => {
        return html`
        <irnmn-carousel
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        `;
    }
};

export const externalControls: Story = {
    render: () => {
        return html`
        <irnmn-carousel
        id="irnmn-carousel-demo"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        </irnmn-carousel>
        <br/>
        <p>External button using component API :</p>
        <button id="prevBtn">Previous</button>
        <button id="nextBtn">Next</button>

        <script>
        const carousel = document.getElementById('irnmn-carousel-demo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        prevBtn.addEventListener('click', () => {
            carousel.prev();
        });

        nextBtn.addEventListener('click', () => {
            carousel.next();
        });
        </script>
        `;
    }
};

export const PagerSlidesMode: Story = {
    render: () => {
        return html`
        <irnmn-carousel
        pager-mode="slides"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
        <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
        <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
        <div class="c-carousel__pager">
            <span class="c-carousel__pagerCurrent">1</span>
            <span class="c-carousel__pagerSep">/</span>
            <span class="c-carousel__pagerTotal">4</span>
        </div>
        </irnmn-carousel>
        `;
    }
};


export const dynamicSlidesChange: Story = {
    render: () => {
        return html`
        <irnmn-carousel
        id="irnmn-carousel-demo2"
        selectors='{
            "VIEWPORT": ".c-carousel__viewport",
            "SLIDES": ".c-carousel__slide",
            "PREV_BUTTON": ".c-carousel__nav--prev",
            "NEXT_BUTTON": ".c-carousel__nav--next",
            "CURRENT_SLIDE": ".c-carousel__pagerCurrent",
            "TOTAL_SLIDES": ".c-carousel__pagerTotal"
        }'
        >
        <div class="c-carousel__viewport">
            <article class="c-carousel__slide" style="aspect-ratio: 3/2;">
            <img src="https://picsum.photos/id/1015/1200/800" alt="Bedroom interior" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 3/4;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 2/3;">
            <img src="https://picsum.photos/id/1033/1200/800" alt="Architectural detail" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 1/1;">
            <img src="https://picsum.photos/id/1024/1200/800" alt="Warm living space" />
            </article>

            <article class="c-carousel__slide" style="aspect-ratio: 4/3;">
            <img src="https://picsum.photos/id/1018/1200/800" alt="Terrace with outdoor seating" />
            </article>
        </div>
            <button type="button" class="c-carousel__nav c-carousel__nav--prev">‹</button>
            <button type="button" class="c-carousel__nav c-carousel__nav--next">›</button>
            <div class="c-carousel__pager">
                <span class="c-carousel__pagerCurrent">1</span>
                <span class="c-carousel__pagerSep">/</span>
                <span class="c-carousel__pagerTotal">4</span>
            </div>
        </irnmn-carousel>

        <br/>
        <h3>Dynamic Slides Change</h3>
        <h4>Add New Slide :</h4>
        <button id="prependSlide">At the beginning</button>
        <button id="appendSlide">At the end</button>
        <h4>Remove Slide :</h4>
        <button id="removeFirstSlide">Remove First</button>
        <button id="removeLastSlide">Remove Last</button>

        <script>
            const carousel = document.getElementById('irnmn-carousel-demo2');
            const prependSlideBtn = document.getElementById('prependSlide');
            const appendSlideBtn = document.getElementById('appendSlide');
            const removeFirstSlideBtn = document.getElementById('removeFirstSlide');
            const removeLastSlideBtn = document.getElementById('removeLastSlide');

            if (!carousel) {
                console.error('[demo] Carousel not found');
            }

            const viewport =
                carousel?.querySelector('.c-carousel__viewport') ||
                carousel?.querySelector('[data-carousel-viewport]');

            if (!viewport) {
                console.error('[demo] Viewport not found inside carousel');
            }

            // Pool of images + possible aspect ratios
            const IMAGE_POOL = [
                'https://picsum.photos/id/1015/1200/800',
                'https://picsum.photos/id/1018/1200/800',
                'https://picsum.photos/id/1024/1200/800',
                'https://picsum.photos/id/1033/1200/800',
                'https://picsum.photos/id/1025/1200/800',
                'https://picsum.photos/id/1019/1200/800',
            ];

            const ASPECT_RATIOS = ['3/2', '4/3', '3/4', '2/3', '1/1'];

            const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

            const createRandomSlide = () => {
                const article = document.createElement('article');
                article.className = 'c-carousel__slide';
                article.style.aspectRatio = rand(ASPECT_RATIOS);

                const img = document.createElement('img');
                img.src = rand(IMAGE_POOL);
                img.alt = 'generated image';
                img.loading = 'lazy';
                img.decoding = 'async';

                article.appendChild(img);
                return article;
            };

            prependSlideBtn?.addEventListener('click', () => {
                if (!viewport) return;
                viewport.prepend(createRandomSlide());
            });

            appendSlideBtn?.addEventListener('click', () => {
                if (!viewport) return;
                viewport.appendChild(createRandomSlide());
            });

            removeFirstSlideBtn?.addEventListener('click', () => {
                if (!viewport) return;
                const first = viewport.firstElementChild;
                if (first) first.remove();
            });

            removeLastSlideBtn?.addEventListener('click', () => {
                if (!viewport) return;
                const last = viewport.lastElementChild;
                if (last) last.remove();
            });
        </script>
        `;
    }
};
