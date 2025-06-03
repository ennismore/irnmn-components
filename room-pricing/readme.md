# irnmn-room-pricing

A custom web component for displaying room pricing with date selection, designed for hotel or accommodation booking interfaces.

## Features

- Integrates a calendar for selecting check-in and check-out dates.
- Dynamically displays pricing based on selected dates.
- Shows loading state and handles unavailable rates.
- Customizable labels for localization and messaging.

## Usage

```html
<irnmn-room-pricing
    room-code="DELUXE"
    checkin-date-name="checkin"
    checkout-date-name="checkout"
    date-locale="en-US"
    date-name="date-selection"
    price="120"
    loading="false"
    labels='{
        "placeholder": "Select dates for prices",
        "noRatesMessage": "No rates available",
        "loading": "Loading...",
        "from": "From",
        "night": "night",
        "legalText": "*Taxes included"
    }'
></irnmn-room-pricing>
```

## Attributes

| Attribute            | Type    | Description                                                      |
|----------------------|---------|------------------------------------------------------------------|
| `room-code`          | String  | Room identifier code.                                            |
| `checkin-date-name`  | String  | Name for check-in date input.                                    |
| `checkout-date-name` | String  | Name for check-out date input.                                   |
| `date-locale`        | String  | Locale for date formatting (e.g., `en-US`).                      |
| `date-name`          | String  | Name for the date selection group (default: `date-selection`).   |
| `price`              | String  | Price value to display.                                          |
| `loading`            | Boolean | Show loading spinner if `true` or `1`.                           |
| `labels`             | JSON    | Custom labels for UI text (see example above).                   |

## Events

This component does not emit custom events, but relies on attribute changes and session storage for date management.

## Dependencies

- `<irnmn-calendar>`: Custom calendar element for date selection.

## Styling

Customize styles using the following classes:

- `.irnmn-room-pricing__calendar`
- `.irnmn-room-pricing__loading`
- `.irnmn-room-pricing__noavailable`
- `.irnmn-room-pricing__price`
- `.irnmn-room-pricing__price-value`
- `.irnmn-room-pricing__mention`
