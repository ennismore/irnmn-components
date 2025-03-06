# IRNMNBookingMarriot Component

Web component that handles the specifics of the allinclusive-collection.com booking engine. It processes form submissions, validates hotel codes, calculates the length of stay, and dynamically creates hidden input fields required by the booking engine.

## Attributes
The following attributes can be added to the `IRNMNBookingMarriot` element to customize its behavior:

| Attribute          | Description                                                                 | Default Value |
|--------------------|-----------------------------------------------------------------------------|---------------|
| `form-id`          | The ID of the form element associated with the booking system.              | `null`        |
| `start-date-name`  | The name attribute for the check-in date input field.                       | `startDate`   |
| `end-date-name`    | The name attribute for the check-out date input field.                      | `endDate`     |
| `hotel-codes`      | A JSON string representing an array of supported hotel codes.               | `[]`          |

## Methods
The following methods are exposed by the component for internal logic and can be extended if needed:

- `connectedCallback()`: Called when the element is added to the document. It sets up the form submission event listener.
- `disconnectedCallback()`: Called when the element is removed from the document. It removes the form submission event listener.
- `handleMarriotBookingEngine(event)`: Handles the form submission, processes the form data, and creates hidden input fields.
- `formatDate`: Format the date in correct format
- `createHiddenInput(form, name, value)`: (from utils/components.js) Creates a hidden input field and appends it to the form.

## Usage

Here's an example of how to use the `IRNMNBookingMarriot` component in your HTML:

```html
<irnmn-booking-marriot
    form-id="bookingForm"
    start-date-name="checkin"
    end-date-name="checkout"
    hotel-codes='["C383", "C384", "C385"]'>
</irnmn-booking-marriot>
