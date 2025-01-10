# IRNMNBookingAllCom Component

Web component that handles the specifics of the all.com booking engine. It processes form submissions, validates hotel codes, calculates the length of stay, and dynamically creates hidden input fields required by the booking engine.

**IMPORTANT**
This component does not currently support multiple rooms. There will need to be an extensive edit to the rooms, adults, children and children age logic in order to support multi room. If moving to WC approach to multi room, look at the `guest-summary` component on how it handles this.

When looking to make this component more universal pay attention to the formData value it is getting. Currently it is looking for `startDate`, `endDate`, `adults`, `children`. These values are currently needed, but these values can be changed to support the values that Glitter booking engine use. The idea being there should be a set of defaults values we can pull from. It makes sense that these "defaults" be the Glitter values, however this will likely mean an edit to the irnmn-parent theme.

## Attributes
The following attributes can be added to the `IRNMNBookingAllCom` element to customize its behavior:

| Attribute          | Description                                                                 | Default Value |
|--------------------|-----------------------------------------------------------------------------|---------------|
| `form-id`          | The ID of the form element associated with the booking system.              | `null`        |
| `start-date-name`  | The name attribute for the check-in date input field.                       | `startDate`   |
| `end-date-name`    | The name attribute for the check-out date input field.                      | `endDate`     |
| `hotel-codes`      | A JSON string representing an array of supported hotel codes.               | `[]`          |
| `child-age`        | The default age to be used for children when creating hidden input fields.  | `6`           |

## Methods
The following methods are exposed by the component for internal logic and can be extended if needed:

- `connectedCallback()`: Called when the element is added to the document. It sets up the form submission event listener.
- `disconnectedCallback()`: Called when the element is removed from the document. It removes the form submission event listener.
- `handleAllComBookingEngine(event)`: Handles the form submission, processes the form data, and creates hidden input fields.
- `createInput(form, name, value)`: Creates a hidden input field and appends it to the form.

## Usage

Here's an example of how to use the `IRNMNBookingAllCom` component in your HTML:

```html
<irnmn-booking-all-com
    form-id="bookingForm"
    start-date-name="checkin"
    end-date-name="checkout"
    hotel-codes='["C282", "C283", "C284"]'
    child-age="6">
</irnmn-booking-all-com>
