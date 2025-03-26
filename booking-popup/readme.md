# IRNMNBookingModal

`IRNMNBookingModal` is a custom web component that provides a booking modal functionality. It is built using the Web Components API and extends the `HTMLElement` class.

## Features

- Fully customizable modal with content fetched from a remote endpoint.
- Supports form submission with or without a modal.
- Timer functionality for automatic form submission.
- Accessibility features including focus trapping and keyboard navigation.
- Event-driven architecture with custom events for modal lifecycle (`irnmn-modal-loaded`, `irnmn-modal-opened`, `irnmn-modal-closed`).

## Attributes

| Attribute              | Description                                                                 | Default Value                          |
|------------------------|-----------------------------------------------------------------------------|----------------------------------------|
| `form-id`              | ID of the form associated with the modal.                                   | `null`                                 |
| `has-modal`            | Enables or disables the modal.                                              | `false`                                |
| `modal-endpoint`       | URL endpoint to fetch modal content.                                        | `null`                                 |
| `modal-close`          | Label for the close button.                                                 | `"Close"`                              |
| `modal-timer`          | Countdown timer in seconds for automatic form submission.                   | `0`                                    |
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
The `IRNMNBookingModal` component provides flexibility for styling through its CSS classes. Below is a list of the key classes and their purposes, along with an example of how you can customize the modal's appearance:

### CSS Classes

| Class Name                        | Description                                                                 |
|-----------------------------------|-----------------------------------------------------------------------------|
| `irnmn-booking-modal`             | The main container for the modal.                                           |
| `irnmn-booking-modal__container`  | The inner container that holds the modal content.                          |
| `irnmn-booking-modal__close`      | The close button for the modal.                                             |
| `irnmn-booking-modal--visible`    | Applied to the modal when it is visible.                                    |

### Notes

- You can override these styles in your own CSS file to match your application's design.
- The `irnmn-booking-modal--visible` class is added dynamically when the modal is displayed. You can use this class to add animations or transitions for showing and hiding the modal.

By customizing these styles, you can ensure the modal aligns with your application's branding and user experience requirements.

### Explanation of `form-need-validation`

The `form-need-validation` attribute determines whether the associated form should be validated before submission. The modal will show only if the form associated to `form-id` has the attribute `valid` (value doesn't matter). This validation is NOT handled in this component; it will only look for the `valid` attribute to know if the modal should be shown on submission.

### Explanation of `modal-endpoint`

The `modal-endpoint` attribute allows you to fetch modal content dynamically from a remote endpoint. If this attribute is set, the modal will fetch and display the content from the specified URL. If not set, the modal will not display any content.

## Timer
The `modal-timer` attribute specifies a countdown timer in seconds for automatic form submission after a delay in second, if set to 0, the submission will be only manual.
If the user close the modal - the timer will be stopped.
When the timer is active, the modal can display the remaining time, allowing users to see how much time is left before the form is submitted automatically.

### Displaying the Countdown

To display the countdown timer in the modal, you can use the `modal-timer` class in the post content the modal will fetch the content from.
This class is dynamically updated with the remaining time during the countdown.

Example:

```html
<div class="imy-modal-timer-countdown">
    You will be redirected in: <span class="modal-timer">10</span> seconds unless you close this window
</div>
```
