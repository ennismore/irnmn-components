import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import '../room-card/index.js';
import '../slider/index.js'; // slider is used in room-card
import '../popup/index.js'; // popup is used in room-card
import '../room-card/style.css';
import readme from '../room-card/README.md?raw';

// Automatically get all .css files from room-card folder except "style.css"
const variantFiles = import.meta.glob('../room-card/*.css', {
  as: 'url',
  eager: true,
});

const variantOptions: string[] = ['default'];
const variantStyles: Record<string, string> = {};

for (const path in variantFiles) {
  const match = path.match(/\/room-card\/(.*)\.css$/);
  const name = match?.[1];
  if (name && name !== 'style') {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    variantOptions.push(label);
    variantStyles[label] = (variantFiles as Record<string, string>)[path];
  }
}

const meta: Meta = {
  title: 'Components/RoomCard',
  component: 'irnmn-room-card',
  parameters: {
    docs: {
      description: {
        component: readme,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    version: {
      control: { type: 'select' },
      options: variantOptions,
      description: 'Visual variant of the room card',
    },
  },
};

export default meta;
type Args = { version: string };
type Story = StoryObj<Args>;

const injectVariantStyle = (version: string) => {
  const styleId = 'room-card-branded-style';
  const existing = document.getElementById(styleId);
  if (existing) existing.remove();

  if (version !== 'default') {
    const href = variantStyles[version];
    if (href) {
      const link = document.createElement('link');
      link.id = styleId;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }
};

const renderCard = () => html`
    <irnmn-room-card
        room-code="D2A"
        checkin-date-name="checkin"
        checkout-date-name="checkout"
        date-name="checkInOutDates"
        date-locale="en"
        title="DELUXE SEA VIEW"
        description="Stay in the comfort and warmth with description dio porta dis augue parturient condimentum mi diam lacus, praesent varius ante sapien gravida vestibulum class cras integer risus."
        images='[{"url":"https://picsum.photos/id/10/300/200","alt":"Room image 1"},{"url":"https://picsum.photos/id/89/300/200","alt":"Room image 2"},{"url":"https://picsum.photos/id/12/300/200","alt":"Room image 3"}]'
        link-360="https://example.com/room-details"
        extras='["1-2 Guests", "Queen Bed", "28 m²", "City View"]'
        room-amenities='["Malin+Goetz shower amenities","High-def smart TV", "Mini-bar", "Safe", "Lavazza coffee and tea"]'
        hotel-amenities='["Spa & Wellness", "High-Speed wifi", "Luxury Concierge", "Private Parking", "Bicycle rental"]'
        labels='{"placeholder":"Add dates for prices","heading":"Select date for prices","from":"From","night":"Night","legalText":"(inc taxes and fees)","noRates":"No availability on those dates","noRatesMessage":"Please select different dates"}'
    ></irnmn-room-card>
`;

export const Default: Story = {
  args: {
    version: 'default',
  },
  render: ({ version }) => {
    injectVariantStyle(version);
    return renderCard();
  },
};

export const OneColumn: Story = {
  args: {
    version: 'default',
  },
  render: ({ version }) => {
    injectVariantStyle(version);
    return html`
      <div class="--one-column" style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        ${renderCard()}
      </div>
    `;
  },
};

export const TwoColumns: Story = {
  args: {
    version: 'default',
  },
  render: ({ version }) => {
    injectVariantStyle(version);
    return html`
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem;">
        ${renderCard()} ${renderCard()}
      </div>
    `;
  },
};

export const ThreeColumns: Story = {
  args: {
    version: 'default',
  },
  render: ({ version }) => {
    injectVariantStyle(version);
    return html`
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
        ${renderCard()} ${renderCard()} ${renderCard()}
      </div>
    `;
  },
};
