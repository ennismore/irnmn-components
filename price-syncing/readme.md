# `<irnmn-price-syncing>` – Room Price Syncing Web Component

A custom web component for automatically syncing and updating room prices in real time, based on selected check-in and check-out dates.

## Features

- Fetches room prices from a remote API.
- Listens for date changes and updates prices accordingly.
- Supports multiple currencies and locale formatting.
- Integrates with `<irnmn-room-pricing>` elements.

## Usage

```html
<irnmn-price-syncing
    hotel-ref-id="HOTEL123"
    api-endpoint="https://api.example.com/availabilities"
    checkin-date-name="checkin"
    checkout-date-name="checkout"
    date-name="date-selection"
    locale="en"
></irnmn-price-syncing>

<!-- Example room pricing elements -->
<irnmn-room-pricing room-code="DELUXE"></irnmn-room-pricing>
<irnmn-room-pricing room-code="STANDARD"></irnmn-room-pricing>
```

## Attributes

| Attribute           | Description                                      | Required | Default           |
|---------------------|--------------------------------------------------|----------|-------------------|
| `hotel-ref-id`      | Hotel reference ID for API requests              | Yes      |                   |
| `api-endpoint`      | API endpoint URL for fetching availabilities     | Yes      |                   |
| `checkin-date-name` | Session storage key for check-in date            | Yes      |                   |
| `checkout-date-name`| Session storage key for check-out date           | Yes      |                   |
| `date-name`         | Suffix for date keys in session storage          | No       | `date-selection`  |
| `locale`            | Language/locale code for formatting              | No       |                   |

## How It Works

1. On insertion, the component finds all sibling `<irnmn-room-pricing>` elements.
2. Fetches room rates from the API using session-stored dates.
3. Updates each room pricing element with the lowest available rate.
4. Listens for custom date change events and re-syncs prices.

## Events

- Listens for `checkout-selected-{dateName}` events on `document` to trigger price updates.

## API Key

> **Note:** The API key is currently hardcoded in the component. For production, use a secure method to handle API keys.
