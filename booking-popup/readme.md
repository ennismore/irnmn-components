# IRNMNBookingModal

`IRNMNBookingModal` is a custom web component that extends the `IRNMNPopup` component to provide booking-specific functionality. It leverages the Web Components API and builds upon the generic popup functionality to include features like form validation, timer-based submission, and modal handling.

## Features

- Extends the `IRNMNPopup` component for reusable popup functionality.
- Adds booking-specific features such as form validation and timer-based submission.
- Fully customizable modal with content fetched from a remote endpoint.
- Accessibility features including focus trapping and keyboard navigation.
- Event-driven architecture with custom events for modal lifecycle (`irnmn-modal-loaded`, `irnmn-modal-opened`, `irnmn-modal-closed`).

## Attributes

| Attribute              | Description                                                       | Default Value | Inherited from `IRNMNPopup` |
| ---------------------- | ----------------------------------------------------------------- | ------------- | --------------------------- |
| `form-id`              | ID of the form associated with the modal.                         | `null`        | No                          |
| `has-modal`            | Enables or disables the modal.                                    | `false`       | No                          |
| `modal-endpoint`       | URL endpoint to fetch modal content.                              | `null`        | Yes                         |
| `modal-close`          | Label for the close button.                                       | `"Close"`     | Yes                         |
| `modal-timer`          | Countdown timer in seconds for automatic form submission.         | `0`           | No                          |
| `form-need-validation` | Indicates whether the form requires validation before submission. | `true`        | No                          |

## Accessibility

- Inherits accessibility features from `IRNMNPopup`, such as focus trapping and ARIA attributes.
- Escape key closes the modal.

## Usage example

Add the `irnmn-booking-modal` element to your HTML and configure it using attributes:

```html
<form id="booking-form" valid>
    <input type="text" name="name" placeholder="Your Name" required />
    <button type="submit">Book Now</button>
</form>

<irnmn-booking-modal
    form-id="booking-form"
    has-modal="true"
    modal-close="Cancel"
    modal-timer="10"
    modal-endpoint="https://example.com/modal-content"
    form-need-validation="true"
></irnmn-booking-modal>
```

### Styling
The `IRNMNBookingModal` component inherits styling capabilities from `IRNMNPopup`. Below are the key CSS classes specific to the booking modal:

## Notes

- You can override these styles in your own CSS file to match your application's design.
- The `irnmn-booking-modal--visible` class is added dynamically when the modal is displayed. You can use this class to add animations or transitions for showing and hiding the modal.

By customizing these styles, you can ensure the modal aligns with your application's branding and user experience requirements.

### Explanation of `form-need-validation`

The `form-need-validation` attribute determines whether the associated form should be validated before submission. The modal will show only if the form associated with `form-id` has the attribute `valid` (value doesn't matter). This validation is NOT handled in this component; it will only look for the `valid` attribute to know if the modal should be shown on submission.

### Explanation of `modal-endpoint`

The `modal-endpoint` attribute allows you to fetch modal content dynamically from a remote endpoint. If this attribute is set, the modal will fetch and display the content from the specified URL. If not set, the modal will not display any content.

## Timer
The `modal-timer` attribute specifies a countdown timer in seconds for automatic form submission after a delay. If set to 0, the submission will be only manual. If the user closes the modal, the timer will be stopped. When the timer is active, the modal can display the remaining time, allowing users to see how much time is left before the form is submitted automatically.

### Displaying the Countdown

To display the countdown timer in the modal, you can use the `modal-timer` class in the content fetched by the modal.

Example:

```html
<div class="imy-modal-timer-countdown">
    You will be redirected in: <span class="modal-timer">10</span> seconds unless you close this window
</div>
```
