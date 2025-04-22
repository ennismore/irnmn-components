# IRNMNBookingTracking Web Component

The `IRNMNBookingTracking` class is a custom web component that extends `HTMLElement`. It is designed to handle form submissions and track booking-related events.

## Features

- Listens for form submissions and tracks booking events.
- Pushes tracking events to the `dataLayer` for analytics.
- Includes debugging capabilities for development.

## Usage

To use the `IRNMNBookingTracking` component, include it in your HTML and configure its attributes as needed.

### Example

```html
<irnmn-booking-tracking
    form-id="booking-form"
    start-date-name="startDate"
    end-date-name="endDate"
    promo-code-name="promoCode"
    placement="booking bar"
    need-validation="true"
    debug="true">
</irnmn-booking-tracking>
```

### Attributes

| Attribute            | Description                                                                 | Default Value       |
|----------------------|-----------------------------------------------------------------------------|---------------------|
| `form-id`            | The ID of the form to track.                                               | `null`              |
| `start-date-name`    | The name of the start date field in the form.                              | `startDate`         |
| `end-date-name`      | The name of the end date field in the form.                                | `endDate`           |
| `promo-code-name`    | The name of the promo code field in the form.                              | `rateCode`          |
| `placement`          | The placement of the tracking event (e.g., "booking bar").                | `booking bar`       |
| `need-validation`    | Whether the form requires validation before tracking.                     | `false`             |
| `debug`              | Enables debug mode to log tracking events to the console.                 | `false`             |

## Tracking Event Structure

The tracking event pushed to the `dataLayer` has the following structure:

```json
{
    "event": "room_check_availability",
    "destination": "hotel_name",
    "checkin_date": "YYYY-MM-DD",
    "checkout_date": "YYYY-MM-DD",
    "rooms": 1,
    "adult": 2,
    "child": 1,
    "placement": "booking bar",
    "code": "promo_code"
}
```

## Debugging

Set the `debug` attribute to `true` to log the tracking event to the console for debugging purposes.

## Note

For the moment event name will always be `room_check_availability`
