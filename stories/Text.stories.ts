import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {html} from "lit";
import IRNMNText from "../text";

//import { Button } from './Button';

const meta: Meta<IRNMNText> = {
    title: 'Components/Text',
    tags: ['autodocs'],
    component: 'irnmn-text',
    render: (args) => {
        return html`<irnmn-text label="Promo Code" placeholder="Enter your promo code" name="promoCode">asfasf</irnmn-text>`;
    }
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/*export const Default = () => {
    return document.createElement('irnmn-text');
} */

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
/* export default {
  title: 'Component/Button',
  tags: ['autodocs'],
  render: (args) => Button(args),
  argTypes: {
    backgroundColor: { control: 'color' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  args: { onClick: fn() },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Button',
  },
}; */
