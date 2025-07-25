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
            <div class="slider-container">
                <div class="slider-slide" style="background-color:yellow; justify-content:center; display:flex; align-items:center;"><b>SLIDE #1</b></div>
                <div class="slider-slide" style="background-color:red; justify-content:center; display:flex; align-items:center;"><b>SLIDE #2</b></div>
                <div class="slider-slide" style="background-color:blue; justify-content:center; display:flex; align-items:center;"><b>SLIDE #3</b></div>
                <div class="slider-slide" style="background-color:green; justify-content:center; display:flex; align-items:center;"><b>SLIDE #4</b></div>
            </div>
            <div class="slider-navigation">
                <button class="slider-prev">Previous</button>
                <span>
                    <span class="current-slide">1</span> /
                    <span class="total-slides">3</span>
                </span>
                <button class="slider-next">Next</button>
            </div>
        </irnmn-slider>
        `;
    }
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
