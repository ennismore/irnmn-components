import { html } from 'lit-html';
import '../room-card/index.js';
import '../slider/index.js';
import '../popup/index.js';
import '../room-card/style.css';

// to get variables from
import rawCss from '../room-card/style.css?raw';

const cssVarsConfig = extractCssVars(rawCss);

console.log('CSS Variables Config:', cssVarsConfig);

function extractCssVars(cssText: string): Record<string, any> {
    const rootMatch = cssText.match(/:root\s*{([^}]*)}/s);
    if (!rootMatch) return {};

    const varsBlock = rootMatch[1];
    const lines = varsBlock.split(';').map(line => line.trim()).filter(Boolean);

    const config: Record<string, any> = {};

    for (const line of lines) {
        const [rawKey, rawValue] = line.split(':').map(part => part.trim());
        if (!rawKey?.startsWith('--') || !rawValue) continue;

        const isPx = /^\d+px$/.test(rawValue);
        config[rawKey] = {
        control: isPx
            ? { type: 'range', min: 0, max: 100 }
            : 'text',
        defaultValue: isPx
            ? Number(rawValue.replace(/[^0-9.]/g, '')) // fix here
            : rawValue,
        unit: isPx ? 'px' : '',
        };
    }

    return config;
}


export default {
  title: 'Playground/CSS Variables',
  argTypes: Object.fromEntries(
    Object.entries(cssVarsConfig).map(([key, config]) => [key, config])
  ),
};

const applyCssVars = (vars: Record<string, any>, argTypes: Record<string, any>) => {
  for (const [key, value] of Object.entries(vars)) {
    if (!(key in argTypes)) continue;
    const unit = argTypes[key]?.unit ?? '';
    document.documentElement.style.setProperty(key, `${value}${unit}`);
  }
};

const Template = (
  args: Record<string, any>,
  { argTypes }: { argTypes: Record<string, any> }
) => {
  applyCssVars(args, argTypes);

  return html`
    <div style="padding: 2rem; border: 1px dashed gray;">
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
    </div>
  `;
};

export const LiveEditor = Template.bind({});
LiveEditor.args = Object.fromEntries(
  Object.entries(cssVarsConfig).map(([key, config]) => [key, config.defaultValue])
);
