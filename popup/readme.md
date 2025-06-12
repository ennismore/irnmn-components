# IRNMNPopup Component

The **IRNMNPopup** is a general-purpose popup component that provides accessible modals with support for API-based content loading **or** `<template>` content. It includes accessibility features such as keyboard navigation, focus trapping, and optional one-time display per session.

## Features

- **Accessible Modals**: Keyboard navigation, focus trapping, ARIA attributes, and focus restoration for accessibility compliance.
- **API or Template Content**: Dynamically fetches and displays content from a specified API endpoint, or uses a `<template>` child for static content.
- **Session-Based Display**: Optionally restricts the modal to display only once per session.
- **Dynamic Styles**: Supports loading stylesheets dynamically from API-provided URLs.
- **Custom Labeling**: Supports `labelledby` for improved accessibility.

## Usage

### Installation

Include the component in your project by adding the custom element definition:

```js
import { IRNMNPopup } from './path/to/irnmn-modal.js';
customElements.define('irnmn-modal', IRNMNPopup);
```

### Example: API Content

```html
<irnmn-modal
    modal-endpoint="https://example.com/api/modal-content"
    modal-close="Close"
    session-key="unique-session-key"
    init-show="true">
</irnmn-modal>
```

### Example: Template Content

```html
<irnmn-modal modal-content="template" modal-close="Dismiss">
  <template>
    <h2>Welcome!</h2>
    <p>This is static modal content.</p>
    <button data-close>OK</button>
  </template>
</irnmn-modal>
```

### Attributes

| Attribute              | Description                                                                 | Default Value |
| ---------------------- | --------------------------------------------------------------------------- | ------------- |
| `modal-endpoint`       | URL endpoint to fetch modal content (used if `modal-content` is not `template`). | `null`        |
| `modal-content`        | Content source type: `'endpoint'` (default) or `'template'`.                | `'endpoint'`  |
| `modal-close`          | Label for the close button.                                                 | `"Close"`     |
| `session-key`          | Unique key to track session-based display of the modal.                     | `null`        |
| `init-show`            | Whether the modal should be initially displayed (`"true"` or `"false"`).    | `false`       |
| `labelledby`           | ID of the element that labels the modal for accessibility.                  | `""`          |

## Showing and Closing the Popup

### Showing the Popup

To programmatically show the popup, call the `open()` method on the `irnmn-modal` element:

```javascript
document.querySelector('irnmn-modal').open();
```

This will display the modal, set the appropriate accessibility attributes, and dispatch the `irnmn-modal-opened` event.

### Closing the Popup

To programmatically close the popup, call the `close()` method on the `irnmn-modal` element:

```javascript
document.querySelector('irnmn-modal').close();
```

This will hide the modal, restore focus to the previously focused element, and dispatch the `irnmn-modal-closed` event.

You can also close the modal by clicking the close button, clicking outside the modal, pressing the Escape key, or clicking any element with the `data-close` attribute inside the modal.

## Events

| Event Name           | Description                          |
| -------------------- | ------------------------------------ |
| `irnmn-modal-loaded` | Fired when the modal is initialized. |
| `irnmn-modal-opened` | Fired when the modal is opened.      |
| `irnmn-modal-closed` | Fired when the modal is closed.      |

## Accessibility

The component is designed with accessibility in mind, including:

- Keyboard navigation support and focus trapping within the modal.
- Focus restoration to the previously focused element upon modal closure.
- ARIA attributes for screen reader compatibility, including support for `labelledby`.
- Escape key and click-outside-to-close support.

## Styling Classes

- `.irnmn-modal`: The root `<dialog>` element of the modal dialog.
- `.irnmn-modal__container`: The inner container that holds the modal content and close button.
- `.irnmn-modal__close`: The close button inside the modal.
- `.irnmn-modal--visible`: Added dynamically when the modal is displayed (use for transitions/animations).

You can override these styles in your own CSS file to match your application's design. The component dynamically loads stylesheets provided by the API, ensuring the modal matches the design requirements.

## API Integration

When using API-based content, the modal fetches its content and styles dynamically from the specified `modal-endpoint`. The API response should include the following structure:

```json
{
  "content": {
    "rendered": "<p>Your modal content here</p>"
  },
  "blockAssets": {
    "styles": ["https://example.com/styles.css"]
  }
}
```

- `content.rendered`: The HTML content to display inside the modal.
- `blockAssets.styles`: An array of stylesheet URLs to load dynamically.

## Notes

- If `session-key` is set, the modal will only show once per session (using `sessionStorage`).
- If `modal-content="template"`, the first `<template>` child will be used as the modal content.
- The modal uses the native `<dialog>` element for accessibility and focus management.
- The component exposes `open()` and `close()` methods for programmatic control.
- The `labelledby` attribute can be used to improve accessibility by associating the modal with a label element.

