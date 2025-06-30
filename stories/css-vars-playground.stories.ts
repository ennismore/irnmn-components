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
const cssVarsConfig: Record<string, any> = {};
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

  const readableLabel = varName.replace('--', '').replace(/-/g, ' ') + (unit ? ` (${unit})` : '');

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
    name: ` ↳ ${readableLabel}`,
    control,
    defaultValue: varData.isReference ? undefined : defaultValue,
    unit,
    table: { category: varData.category },
    if: { arg: `__switch__${varName}`, eq: 'Custom' },
  };

  // Reference dropdown
  cssVarsConfig[`__ref__${varName}`] = {
    name: ` ↳ ${readableLabel} Ref`,
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
  }
};

// ---- Storybook Metadata ----
export default {
  title: 'Playground/Live Editor',
  argTypes: cssVarsConfig,
};

// ---- Story Template ----
const Template = (args: Record<string, any>) => {
    applyCssVars(args);
    const changedVars = getChangedVars(args);
    const cssText = Object.entries(changedVars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');

    // Function to open the modal (must be outside html template)
    setTimeout(() => {
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

    return html`
      <div style="margin-bottom: 2rem; border: 1px dashed gray;">
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


// ---- Initial Values ----
export const LiveEditor = Template.bind({});
LiveEditor.args = Object.fromEntries(
  Object.entries(cssVarsConfig).map(([key, config]) => [key, config.defaultValue])
);
