import { html } from 'lit-html';

// Register components and base styles
import '../room-card/index.js';
import '../slider/index.js';
import '../popup/index.js';
import '../room-card/style.css';

// ---- Load the CSS text directly (adjust path if needed) ----
import rawCss from '../room-card/style.css?raw';

// ---- Parse CSS Variables + Category Comments ----
const cssVarsConfig: Record<string, any> = {};
let currentCategory = 'Global';

// Split the CSS content into individual lines for parsing
const lines = rawCss.split('\n');

for (const line of lines) {
  // Look for a category comment in the format /* => Category Name */
  const categoryMatch = line.match(/\/\*\s*=>\s*(.+?)\s*\*\//);
  if (categoryMatch) {
    // If found, set the current category to apply to following variables
    currentCategory = categoryMatch[1].trim();
  }

  // Look for CSS custom property declarations, e.g. --my-var: value;
  const varMatch = line.match(/--([a-zA-Z0-9-_]+)\s*:\s*(.+?);/);
  if (varMatch) {
    const name = `--${varMatch[1]}`;     // Full variable name (with -- prefix)
    const value = varMatch[2].trim();     // Raw value from CSS

    let control: any = 'text';            // Default control type in Storybook
    let defaultValue: any = value;        // Default value to apply to the variable
    let unit = '';                        // Unit suffix (e.g., 'px' or 'rem')

    // Try to infer a more appropriate control type based on value format

    // If value is a hex color, use the color picker control
    if (/^#[0-9a-f]{3,6}$/i.test(value)) {
      control = 'color';

    // If value is a pixel number (e.g., 16px), use a numeric range slider
    } else if (/^\d+px$/.test(value)) {
      defaultValue = parseInt(value, 10);
      let maxValue = 100;
      if(defaultValue > 100) {
        maxValue = 1000; // Allow larger values for px
      }
      control = { type: 'range', min: 0, max: maxValue};
      unit = 'px';

    // If value is in rem, use a smaller slider with decimal steps
    } else if (/^\d*\.?\d+rem$/.test(value)) {
      control = { type: 'range', min: 0, max: 5, step: 0.125 };
      defaultValue = parseFloat(value);
      unit = 'rem';

    // If value is a percentage, use a range slider
    } else if (/^\d*\.?\d+%$/.test(value)) {
      control = { type: 'range', min: 0, max: 100};
      defaultValue = parseInt(value, 10);
      unit = '%';
    }

    let displayedName = name.replace('--', '').replace(/-/g, ' '); // Displayed name for Storybook
    if (unit) {
      displayedName = `${displayedName} (${unit})`; // Append unit to displayed name
    }

    // Register the variable config to be used by Storybook
    cssVarsConfig[displayedName] = {
      variable : name,               // CSS variable name
      control,                       // Storybook control type
      defaultValue,                  // Default value to display/apply
      unit,                          // Unit suffix to re-append during apply
      table: {
        category: currentCategory, // Control panel grouping
        name: displayedName, // Displayed name in Storybook
      },
    };
  }
}

// ---- Apply variables to document.documentElement ----
const applyCssVars = (vars: Record<string, any>, config: Record<string, any>) => {
    for (const [label, val] of Object.entries(vars)) {
      const variable = config[label]?.variable ?? label;
      const unit = config[label]?.unit ?? '';
      document.documentElement.style.setProperty(variable, `${val}${unit}`);
    }
  };

// ---- Storybook metadata ----
export default {
  title: 'Playground/Live Editor',
  argTypes: Object.fromEntries(
    Object.entries(cssVarsConfig).map(([key, config]) => [key, config])
  ),
};

// ---- Story Template ----
const Template = (args: Record<string, any>, { argTypes }: { argTypes: Record<string, any> }) => {
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

// ---- Initial Values ----
export const LiveEditor = Template.bind({});
LiveEditor.args = Object.fromEntries(
  Object.entries(cssVarsConfig).map(([key, config]) => [key, config.defaultValue])
);
