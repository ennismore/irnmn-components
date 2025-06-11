import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import '../room-card/index.js';
import '../room-card/style.css'; // default base style
import readme from '../room-card/README.md?raw';

// Automatically get all .css files from room-card folder
// except "style.css"
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
type Story = StoryObj<{ version: string }>;

export const Default: Story = {
  args: {
    version: 'default',
  },
  render: ({ version }) => {
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

    return html`
      <irnmn-room-card
        title="Deluxe Sea View"
        description="Spacious room with a beautiful sea view, king-size bed, and private balcony."
        images='["https://picsum.photos/600/400?1", "https://picsum.photos/600/400?2"]'
        extras='["Free Wi-Fi", "Air Conditioning", "Mini Bar"]'
        room-amenities='["King Bed", "Sea View", "Balcony"]'
        hotel-amenities='["Pool", "Spa", "Gym"]'
        labels='{
          "more": "More Info",
          "prevSlide": "Previous",
          "nextSlide": "Next",
          "roomAmenities": "Room Amenities",
          "hotelAmenities": "Hotel Amenities",
          "view360": "View 360"
        }'
      ></irnmn-room-card>
    `;
  },
};
