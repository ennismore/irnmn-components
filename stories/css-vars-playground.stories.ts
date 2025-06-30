import { html } from 'lit-html';

// Register components and base styles
import '../room-card/index.js';
import '../slider/index.js';
import '../popup/index.js';
import '../room-card/style.css';
import rawCss from '../room-card/style.css?raw';

// ---- Parse CSS and prepare variable config ----
const rawVarData: Record<string, any> = {}; // Hold parsed data before building final config
let currentCategory = 'Global';

// First pass: Parse the CSS to extract raw variable info
const lines = rawCss.split('\n');

for (const line of lines) {
  const categoryMatch = line.match(/\/\*\s*=>\s*(.+?)\s*\*\//);
  if (categoryMatch) {
    currentCategory = categoryMatch[1].trim();
  }

  const varMatch = line.match(/--([a-zA-Z0-9-_]+)\s*:\s*(.+?);/);
  if (varMatch) {
    const varName = `--${varMatch[1]}`;
    const value = varMatch[2].trim();

    let control: any = 'text';
    let defaultValue: any = value;
    let unit = '';

    // Infer control type
    if (/^#[0-9a-f]{3,6}$/i.test(value)) {
      control = 'color';
    } else if (/^\d*\.?\d+px$/.test(value)) {
      defaultValue = parseFloat(value);
      control = { type: 'range', min: 0, max: defaultValue > 100 ? 1000 : 100 };
      unit = 'px';
    } else if (/^\d*\.?\d+rem$/.test(value)) {
      defaultValue = parseFloat(value);
      control = { type: 'range', min: 0, max: 5, step: 0.125 };
      unit = 'rem';
    } else if (/^\d*\.?\d+%$/.test(value)) {
      defaultValue = parseFloat(value);
      control = { type: 'range', min: 0, max: 100 };
      unit = '%';
    }

    const readableLabel = varName.replace('--', '').replace(/-/g, ' ') + (unit ? ` (${unit})` : '');

    rawVarData[varName] = {
      name: varName,
      defaultValue,
      control,
      unit,
      category: currentCategory,
      readableLabel,
    };
  }
}

// ---- Second pass: build cssVarsConfig ----
const cssVarsConfig: Record<string, any> = {};
const varNames = Object.keys(rawVarData);

for (const varName of varNames) {
  const { control, defaultValue, unit, category, readableLabel } = rawVarData[varName];

  // Mode switch
  cssVarsConfig[`__switch__${varName}`] = {
    name: `${readableLabel} Mode`,
    control: {type: 'inline-radio'},
    options: ['Custom', 'Reference'],
    defaultValue: 'Custom',
    table: { category },
  };

  // Custom input
  cssVarsConfig[varName] = {
    name: ` ↳ ${readableLabel}`,
    control,
    defaultValue,
    unit,
    table: { category },
    if: { arg: `__switch__${varName}`, eq: 'Custom' },
  };

  // Reference dropdown
  cssVarsConfig[`__ref__${varName}`] = {
    name: ` ↳ ${readableLabel} Ref`,
    control: { type: 'select'},
    options: varNames.filter((v) => v !== varName),
    defaultValue: varNames[0],
    table: { category },
    if: { arg: `__switch__${varName}`, eq: 'Reference' },
  };
}

// ---- Apply variables to document.documentElement ----
const applyCssVars = (args: Record<string, any>) => {
  for (const varName of Object.keys(rawVarData)) {
    const mode = args[`__switch__${varName}`];
    const ref = args[`__ref__${varName}`];
    const val = args[varName];
    const unit = rawVarData[varName]?.unit ?? '';

    const finalValue = mode === 'Reference' ? `var(${ref})` : `${val}${unit}`;
    document.documentElement.style.setProperty(varName, finalValue);
  }
};

// ---- Storybook Metadata ----
export default {
  title: 'Playground/Live Editor',
  argTypes: cssVarsConfig,
};

// ---- Story Template ----
const Template = (args: Record<string, any>, { argTypes }: { argTypes: Record<string, any> }) => {
  applyCssVars(args);

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

// ---- Initial Values ----
export const LiveEditor = Template.bind({});
LiveEditor.args = Object.fromEntries(
  Object.entries(cssVarsConfig).map(([key, config]) => [key, config.defaultValue])
);
