# IRNMNPopup Component

The **IRNMNPopup** is a general-purpose popup component designed to provide accessible modals with support for API-based content loading. It includes features such as keyboard navigation, focus trapping, and optional one-time display per session.

## Features

- **Accessible Modals**: Includes keyboard navigation, focus trapping, and ARIA attributes for accessibility compliance.
- **API-Based Content Loading**: Dynamically fetches and displays content from a specified API endpoint.
- **Session-Based Display**: Optionally restricts the modal to display only once per session.
- **Dynamic Styles**: Supports loading stylesheets dynamically from API-provided URLs.

## Usage

### Installation

Include the component in your project by adding the custom element definition:

### Example

```html
<irnmn-modal
    modal-endpoint="https://example.com/api/modal-content"
    modal-close="Close"
    session-key="unique-session-key"
    init-show="true">
</irnmn-modal>
```

### Attributes

| Attribute              | Description                                                       | Default Value |
| ---------------------- | ----------------------------------------------------------------- | ------------- |
| `modal-endpoint`       | URL endpoint to fetch modal content.                              | `null`        |
| `modal-close`          | Label for the close button.                                       | `"Close"`     |
| `session-key`          | Unique key to track session-based display of the modal.           | `null`        |
| `init-show`            | Whether the modal should be initially displayed.                 | `false`       |

## Showing and Closing the Popup

### Showing the Popup

To programmatically show the popup, call the `showModal` method on the `irnmn-modal` element:

```javascript
const modal = document.querySelector('irnmn-modal');
modal.showModal();
```

This will display the modal, set the appropriate accessibility attributes, and dispatch the `irnmn-modal-opened` event.

### Closing the Popup

To programmatically close the popup, call the `closeModal` method on the `irnmn-modal` element:

```javascript
const modal = document.querySelector('irnmn-modal');
modal.closeModal();
```

This will hide the modal, restore focus to the previously focused element, and dispatch the `irnmn-modal-closed` event.

## Events

| Event Name           | Description                          |
| -------------------- | ------------------------------------ |
| `irnmn-modal-loaded` | Fired when the modal is initialized. |
| `irnmn-modal-opened` | Fired when the modal is opened.      |
| `irnmn-modal-closed` | Fired when the modal is closed.      |

## Accessibility

The component is designed with accessibility in mind, including:

- Keyboard navigation support.
- Focus restoration to the previously focused element upon modal closure.
- ARIA attributes for screen reader compatibility.
- Focus trapping to ensure keyboard navigation remains within the modal.

## Styling Classes

- `.irnmn-modal`: The root element of the modal dialog. Use this selector to style the overall modal container.
- `.irnmn-modal__container`: The inner container that holds the modal content and close button. Customize padding, background, or layout here.
- `.irnmn-modal__close`: The close button inside the modal. Style this to match your design, including hover and focus states.

## Notes

- You can override these styles in your own CSS file to match your application's design.
- The `irnmn-modal--visible` class is added dynamically when the modal is displayed. You can use this class to add animations or transitions for showing and hiding the modal.
- The component dynamically loads stylesheets provided by the API, ensuring the modal matches the design requirements.

## API Integration

The modal fetches its content and styles dynamically from the specified `modal-endpoint`. Ensure the API response includes the following structure:

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

This allows for seamless integration and customization of modal content and appearance.
