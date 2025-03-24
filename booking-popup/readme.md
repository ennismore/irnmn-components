# IRNMNBookingModal

`IRNMNBookingModal` is a custom web component that provides a booking modal functionality. It is built using the Web Components API and extends the `HTMLElement` class.

## Features

- Fully customizable modal with attributes for title, text, CTA, close button, timer, and image.
- Supports form submission with or without a modal.
- Timer functionality for automatic form submission.
- Accessibility features including focus trapping and keyboard navigation.
- Event-driven architecture with custom events for modal lifecycle (`irnmn-modal-loaded`, `irnmn-modal-opened`, `irnmn-modal-closed`).

## Attributes

| Attribute              | Description                                                                 | Default Value                          |
|------------------------|-----------------------------------------------------------------------------|----------------------------------------|
| `form-id`              | ID of the form associated with the modal.                                   | `null`                                 |
| `has-modal`            | Enables or disables the modal.                                              | `false`                                |
| `modal-title`          | Title of the modal.                                                         | `"You will be redirected"`             |
| `modal-text`           | Text content of the modal.                                                  | `"Click continue to proceed to the booking engine"` |
| `modal-cta`            | Label for the CTA button.                                                   | `"Continue"`                           |
| `modal-close`          | Label for the close button.                                                 | `"Close"`                              |
| `modal-timer`          | Countdown timer in seconds for automatic form submission.                   | `0`                                    |
| `modal-image`          | URL of the image to display in the modal.                                   | `null`                                 |
| `use-css-display`      | Toggles the use of CSS `display` property for showing/hiding the modal.     | `true`                                 |
| `form-need-validation` | Indicates whether the form requires validation before submission.           | `true`                                 |

## Events

| Event Name           | Description                                      |
|----------------------|--------------------------------------------------|
| `irnmn-modal-loaded` | Fired when the modal is initialized.             |
| `irnmn-modal-opened` | Fired when the modal is opened.                  |
| `irnmn-modal-closed` | Fired when the modal is closed.                  |

## Methods

### `closeModal(modal)`
Closes the modal and restores focus to the last focused element.

### `startTimer()`
Starts the countdown timer for the modal.

### `stopTimer()`
Stops the countdown timer.

## Accessibility

- Focus trapping ensures keyboard navigation stays within the modal.
- Escape key closes the modal.
- ARIA attributes (`aria-modal`, `aria-hidden`, `role`) enhance accessibility.

## Usage example

Add the `irnmn-booking-modal` element to your HTML and configure it using attributes:

```html
<form id="booking-form">
    <input type="text" name="name" placeholder="Your Name" required />
    <button type="submit">Book Now</button>
</form>

<irnmn-booking-modal
    form-id="booking-form"
    has-modal="true"
    modal-title="Booking Confirmation"
    modal-text="Please confirm your booking details."
    modal-cta="Confirm"
    modal-close="Cancel"
    modal-timer="10"
    modal-image="path/to/image.jpg"
    use-css-display="true"
    form-need-validation="true"
></irnmn-booking-modal>
```

### Explanation of `form-need-validation`

The `form-need-validation` attribute determines whether the associated form should be validated before submission. If set to `true`, the modal will show only if the form associated to `form-id` has the attributes `valid="true"`.
This validation is NOT handled in this component, it will only look for the `valid` attribute to know if the modal should be shown on submission.
