import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {html} from "lit";

import "../../booking-area/index.js";
import "../../location/index.js";
import "../../calendar/index.js";
import "../../guests-summary/index.js";
import "../../rooms-selector/index.js";

import '../../room-card/index.js';
import '../../room-card/style.css';

//import { Button } from './Button';

const meta: Meta = {
    title: 'Components/BookingArea',
    tags: ['autodocs'],
    component: 'irnmn-booking-area'
}

export default meta;

type Story = StoryObj<typeof meta>

const settings = {
    location: {
        locationEndpoint: ""
    }
}

export const Default: Story = {
    render: (args) => {
        return html`<irnmn-booking-area settings=""></irnmn-booking-area>`;
    }
};
