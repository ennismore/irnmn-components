import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {html} from "lit";
import IRNMNSlider from "../slider";
import readme from '../slider/readme.md?raw';
import '../slider/style.css';

const meta: Meta<IRNMNSlider> = {
    title: 'Components/Slider',
    tags: ['autodocs'],
    component: 'irnmn-slider',
    parameters: {
        docs: {
            description: {
            component: readme,
            },
        },
    },
    render: (args) => {
        return html`
        <irnmn-slider debug selectors='{
            "SWIPE_CONTAINER": ".slider-container",
            "SLIDES": ".slider-slide",
            "NAVIGATION": ".slider-navigation",
            "PREV_BUTTON": ".slider-prev",
            "NEXT_BUTTON": ".slider-next",
            "CURRENT_SLIDE": ".current-slide",
            "TOTAL_SLIDES": ".total-slides"
        }'>
            <div class="slider-container" aria-label="My Deluxe room image slider with 5 slides">
                <div class="slider-slide" arial-label="First slide of five">
                    <figure>
                    <img src="https://picsum.photos/id/10/300/200" alt="my image description"/>
                    </figure>
                </div>
                <div class="slider-slide" arial-label="Second slide of five">
                    <figure>
                    <img src="https://picsum.photos/id/20/300/200" alt="my image description"/>
                    </figure>
                </div>
                <div class="slider-slide" arial-label="Third slide of five">
                    <figure>
                    <img src="https://picsum.photos/id/30/300/200" alt="my image description"/>
                    </figure>
                </div>
                <div class="slider-slide" arial-label="Fourth slide of five">
                    <figure>
                    <img src="https://picsum.photos/id/40/300/200" alt="my image description"/>
                    </figure>
                </div>
                <div class="slider-slide" arial-label="Fifth slide of five">
                    <figure>
                    <img src="https://picsum.photos/id/50/300/200" alt="my image description"/>
                    </figure>
                </div>
            </div>
            <div class="slider-navigation">
            <button class="slider-prev" arial-label="Go to previous slide">Previous</button>
            <span>
                <span class="current-slide">1</span> /
                <span class="total-slides">3</span>
            </span>
            <button class="slider-next" aria-label="Go to next slide">Next</button>
            </div>
        </irnmn-slider>
        `;
    }
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
