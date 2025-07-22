import { html } from 'lit-html';

// Register components and base styles
import '../room-card/index.js';
import '../slider/index.js';
import '../popup/index.js';
import '../room-card/style.css';
import rawCss from '../room-card/style.css?raw';
import allBrandsFonts from './custom/fonts/all-brands-fonts.css?url';

// ---- Manual content controls (Title, Badge Label) ----
const manualContentControls = {
    titleText: {
      name: 'Title',
      control: 'text',
      defaultValue: 'QUEEN DELUXE ROOM',
      table: { category: 'CONTENT' },
    },
    extras: {
        name: 'Extras',
        control: 'text',
        defaultValue: '1-2 Guests,Queen Bed,28 m²,City View,lorem ipsum,dolor sit,amet consectetur',
        table: { category: 'CONTENT' },
    },
    description: {
        name: 'Description',
        control: 'text',
        defaultValue: 'Stay in the comfort and warmth with description dio porta dis augue parturient condimentum mi diam lacus, praesent varius ante sapien gravida vestibulum class cras integer risus.',
        table: { category: 'CONTENT' },
    },
    badgeLabel: {
      name: 'Badge Label',
      control: 'text',
      defaultValue: 'limited availability',
      table: { category: 'CONTENT' },
    },
    arrowDesign: {
      name: 'Arrow design',
      control: 'select',
      options: ['mondrian', 'morgans'],
      defaultValue: 'mondrian',
      table: { category: 'CONTENT' },
    },
    columns:{
        name: 'Columns',
        control: 'select',
        options: ['1', '2', '3'],
        defaultValue: '1',
        table: { category: 'CONTENT' },
    }
  };

  const arrowSvgs = {
    mondrian: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="32" viewBox="0 0 18 32" fill="none"><path d="M1.44922 31L16.4492 16L1.44922 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>`,
    morgans: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M13.5 5L20.5 12L13.5 19M3.5 12L20 12" stroke="currentColor" stroke-width="2"/></svg>`,
};

// ---- Parse CSS and prepare variable config ----
const rawVarData: Record<string, any> = {}; // Hold parsed data before building final config
let currentCategory = 'Global';

// First pass: Parse the CSS to extract raw variable info
const lines = rawCss.split('\n');

for (const line of lines) {

// end loop if line match '---end-parsing---'
  if (line.includes('end-parsing')) break;

  // Skip empty lines
  if (!line.trim()) continue;

  const categoryMatch = line.match(/\/\*\s*=>\s*(.+?)\s*\*\//);
  if (categoryMatch) {
    // Update current category if a new one is found
    currentCategory = categoryMatch[1].trim();
  }

  // Match CSS variable definitions like --var-name: value;
  const varMatch = line.match(/--([a-zA-Z0-9-_]+)\s*:\s*(.+?);/);
  if (varMatch) {
    const varName = `--${varMatch[1]}`;
    const value = varMatch[2].trim();
    let isReference = false;
    let referenceTarget = '';

    // Detect if it's referencing another variable (e.g., var(--some-var))
    const referenceMatch = value.match(/^var\((--[a-zA-Z0-9-_]+)\)$/);
    if (referenceMatch) {
      isReference = true;
      referenceTarget = referenceMatch[1];
    }

    // Store raw variable data
    rawVarData[varName] = {
      name: varName,
      rawValue: value,
      isReference,
      referenceTarget,
      category: currentCategory,
    };
  }
}

// Helper: recursively resolve reference type/unit from rawVarData
const resolveReference = (target: string, seen = new Set()): any => {
  if (seen.has(target)) return {}; // Prevent circular refs
  seen.add(target);
  const data = rawVarData[target];
  if (!data) return {};
  if (!data.isReference) return data;
  return resolveReference(data.referenceTarget, seen);
};

// ---- Second pass: build cssVarsConfig with logic-aware filtering ----
const cssVarsConfig: Record<string, any> = { ...manualContentControls }; // Start with manual controls
const varNames = Object.keys(rawVarData);

for (const varName of varNames) {
  const varData = rawVarData[varName];
  const resolved = varData.isReference ? resolveReference(varData.referenceTarget) : {};

  let control: any = 'text';
  let defaultValue: any = varData.rawValue;
  let unit = '';

  // Try to infer type and control from final resolved value (if reference), or direct value
  const value = varData.isReference ? resolved.rawValue : varData.rawValue;
  if (
    /^#[0-9a-f]{3,6}$/i.test(value) ||
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*(?:\d*\.?\d+)\s*)?\)$/i.test(value)
  ) {
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

  const readableLabel = varName.replace('--', '').replace('room-card', '').replace(/-/g, ' ') + (unit ? ` (${unit})` : '');

  // Filtered list of compatible references (same control + unit)
  const compatibleRefs = varNames.filter((v) => {
    if (v === varName) return false;
    const other = resolveReference(v);
    if (!other) return false;
    const otherValue = other.rawValue;
    if (control === 'color') return /^#[0-9a-f]{3,6}$/i.test(otherValue);
    if (unit && otherValue.endsWith(unit)) return true;
    if (!unit && !/^#[0-9a-f]{3,6}$/i.test(otherValue) && !/px|rem|%/.test(otherValue)) return true;
    return false;
  });

  // Mode switch control
  cssVarsConfig[`__switch__${varName}`] = {
    name: `${readableLabel} Mode`,
    control: { type: 'inline-radio' },
    options: ['Custom', 'Reference'],
    defaultValue: varData.isReference ? 'Reference' : 'Custom',
    table: { category: varData.category },
  };

  // Custom input
  cssVarsConfig[varName] = {
    name: ` 🟢 ${readableLabel}`,
    control,
    defaultValue: varData.isReference ? undefined : defaultValue,
    unit,
    table: { category: varData.category },
    if: { arg: `__switch__${varName}`, eq: 'Custom' },
  };

  // Reference dropdown
  cssVarsConfig[`__ref__${varName}`] = {
    name: ` 🔗 ${readableLabel}`,
    control: { type: 'select' },
    options: control != 'text' ? compatibleRefs : varNames, // If text, show all vars
    defaultValue: varData.isReference ? varData.referenceTarget : compatibleRefs[0],
    table: { category: varData.category },
    if: { arg: `__switch__${varName}`, eq: 'Reference' },
  };
}

// ---- Apply variables to document.documentElement ----
const applyCssVars = (args: Record<string, any>) => {
  for (const varName of varNames) {
    const mode = args[`__switch__${varName}`];
    const ref = args[`__ref__${varName}`];
    const val = args[varName];
    const unit = cssVarsConfig[varName]?.unit ?? '';

    const finalValue = mode === 'Reference' ? `var(${ref})` : `${val}${unit}`;
    document.documentElement.style.setProperty(varName, finalValue);
    document.body.style.setProperty(varName, finalValue);
  }
};

// ---- Storybook Metadata ----
export default {
  title: 'Playground/Room Card',
  argTypes: cssVarsConfig,
};

// ---- Story Template ----
const Template = (args: Record<string, any>) => {
    applyCssVars(args);
    const changedVars = getChangedVars(args);
    const cssText = Object.entries(changedVars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');


    loadExternalFontStylesheet(allBrandsFonts);

    setTimeout(() => {
        // Set up the button to show CSS overrides
        const btn = document.getElementById('show-css-btn');
        const dlg = document.getElementById('css-modal') as HTMLDialogElement;
        const pre = document.getElementById('css-preview');

        if (btn && dlg && pre) {
            btn.onclick = () => {
                pre.textContent = cssText || '/* Aucun changement */';
                dlg.showModal();
            };
        }
    }, 0);

    const columns = parseInt(args.columns, 10) || 1;
    return html`
      <div style="margin-bottom: 2rem; border: 1px dashed gray; display: grid; gap: var(--space-1); grid-template-columns: repeat(${columns}, 1fr);">
        ${Array.from({ length: columns }).map(() => html`
          <irnmn-room-card
            room-code="D2A"
            arrow-svg="${arrowSvgs[args.arrowDesign].replace(/"/g, "'")}"
            checkin-date-name="checkin"
            checkout-date-name="checkout"
            date-name="checkInOutDates"
            badge-label="${args.badgeLabel}"
            date-locale="en"
            title="${args.titleText}"
            description="${args.description}"
            images='[{"url":"https://picsum.photos/id/10/300/200","alt":"Room image 1"},{"url":"https://picsum.photos/id/89/300/200","alt":"Room image 2"},{"url":"https://picsum.photos/id/12/300/200","alt":"Room image 3"}]'
            link-360="https://example.com/room-details"
            extras='${JSON.stringify(args.extras.split(",").map((s: string) => s.trim()))}'
            room-amenities='["Malin+Goetz shower amenities","High-def smart TV", "Mini-bar", "Safe", "Lavazza coffee and tea"]'
            hotel-amenities='["Spa & Wellness", "High-Speed wifi", "Luxury Concierge", "Private Parking", "Bicycle rental"]'
            labels='{"placeholder":"Add dates for prices","heading":"Select date for prices","from":"From","night":"Night","legalText":"(inc taxes and fees)","noRates":"No availability on those dates","noRatesMessage":"Please select different dates"}'
          ></irnmn-room-card>
        `)}
      </div>

      <button id="show-css-btn" style="margin-bottom: 1rem; padding: 0.5rem 1rem;">
        See CSS
      </button>

      <dialog id="css-modal" style="max-width: 600px; padding: 1rem; border-radius: 8px;">
        <form method="dialog">
          <button style="float: right;">❌</button>
        </form>
        <h3>🎨 CSS Overrides</h3>
        <pre><code id="css-preview" style="background: #f4f4f4; padding: 1rem; border-radius: 5px; display: block;"></code></pre>
      </dialog>
    `;
  };
// ---- Utility: Get only changed variables to be saved ----
const getChangedVars = (args: Record<string, any>): Record<string, string> => {
    const changes: Record<string, string> = {};

    for (const varName of Object.keys(rawVarData)) {
      const mode = args[`__switch__${varName}`];
      const ref = args[`__ref__${varName}`];
      const val = args[varName];
      const unit = cssVarsConfig[varName]?.unit ?? '';
      const defaultMode = cssVarsConfig[`__switch__${varName}`]?.defaultValue;
      const defaultVal = cssVarsConfig[varName]?.defaultValue;
      const defaultRef = cssVarsConfig[`__ref__${varName}`]?.defaultValue;

      if (mode === 'Reference') {
        if (mode !== defaultMode || ref !== defaultRef) {
          changes[varName] = `var(${ref})`;
        }
      } else if (mode === 'Custom') {
        if (mode !== defaultMode || `${val}${unit}` !== `${defaultVal}${unit}`) {
          changes[varName] = `${val}${unit}`;
        }
      }
    }

    return changes;
  };

  const loadExternalFontStylesheet = (href: string) => {
    if (document.querySelector(`link[href="${href}"]`)) return; // Avoid duplicate loading
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  };

// ---- Initial Values ----
export const LiveEditor = Template.bind({});
LiveEditor.args = Object.fromEntries(
  Object.entries(cssVarsConfig).map(([key, config]) => [key, config.defaultValue])
);
