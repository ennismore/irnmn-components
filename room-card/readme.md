# IRNMN Room Card

A custom web component for displaying hotel room information, images, amenities, and pricing in a card format.

## Features

- Image slider with navigation and optional 360° tour link
- Room and hotel amenities display
- Room extras and description
- Integration with a `<room-pricing>` component
- Customizable labels for accessibility and localization

## Usage

```html
<irnmn-room-card
    room-code="DELUXE"
    checkin-date-name="checkin"
    checkout-date-name="checkout"
    date-name="2024-07-01"
    date-locale="en-US"
    title="Deluxe Room"
    description="A spacious room with sea view."
    images='["/img/room1.jpg", "/img/room2.jpg"]'
    extras='["Free breakfast", "Late checkout"]'
    room-amenities='["WiFi", "Air Conditioning"]'
    hotel-amenities='["Pool", "Gym"]'
    link-360="https://example.com/360"
    labels='{
        "prevSlide": "Previous",
        "nextSlide": "Next",
        "view360": "360° View",
        "more": "More info",
        "roomAmenities": "Room Amenities",
        "hotelAmenities": "Hotel Amenities"
    }'
></irnmn-room-card>
```

## Attributes

| Attribute            | Type    | Description                                 |
|----------------------|---------|---------------------------------------------|
| `room-code`          | String  | Room code identifier                        |
| `checkin-date-name`  | String  | Name for check-in date input                |
| `checkout-date-name` | String  | Name for check-out date input               |
| `date-name`          | String  | Date value                                  |
| `date-locale`        | String  | Locale for date formatting                  |
| `title`              | String  | Room title                                  |
| `description`        | String  | Room description                            |
| `images`             | JSON    | Array of image URLs                         |
| `extras`             | JSON    | Array of extra features                     |
| `room-amenities`     | JSON    | Array of room amenities                     |
| `hotel-amenities`    | JSON    | Array of hotel amenities                    |
| `link-360`           | String  | URL to 360° tour (optional)                 |
| `labels`             | JSON    | Object for custom labels and accessibility  |

## Styling

Style the component using the following class names:

- `.room-card`
- `.room-card__slider`
- `.room-card__content`
- `.room-card__title`
- `.room-card__extras`
- `.room-card__description`
- `.room-card__amenities`
- `.room-card__amenities-title`
- `.room-card__amenities-list`

## Dependencies

- Requires the `<irnmn-slider>` and `<room-pricing>` custom elements.

## Styling

Style the component using the following class names:

- `.room-card`
- `.room-card__slider`
- `.room-card__content`
- `.room-card__title`
- `.room-card__extras`
- `.room-card__description`
- `.room-card__amenities`
- `.room-card__amenities-title`
- `.room-card__amenities-list`

### CSS Variables

You can customize the appearance using these CSS variables:

| Variable                                  | Fallback Variable                    | Default Value                        | Description                        |
| ----------------------------------------- | ------------------------------------ | ------------------------------------ | ---------------------------------- |
| `--room-card-bg`                          |                                      | `#ffffff`                            | Card background color              |
| `--room-card-padding`                     |                                      | `0px`                                | Card padding                       |
| `--room-card-font-family`                 |                                      | `Arial, sans-serif`                  | Font family for card               |
| `--room-card-text-color`                  |                                      | `#000`                               | Main text color                    |
| `--room-card-slider-width`                |                                      | `100%`                               | Slider width                       |
| `--room-card-slider-border-radius`        |                                      | `0px`                                | Slider border radius               |
| `--room-card-slider-button-bg`            |                                      | `rgba(0, 0, 0, 0)`                   | Slider nav button background       |
| `--room-card-slider-button-color`         |                                      | `#ffffff`                            | Slider nav button color            |
| `--room-card-slider-control-button-size`  |                                      | `40px`                               | Slider nav button size             |
| `--room-card-slider-button-radius`        |                                      | `50%`                                | Slider nav button border radius    |
| `--room-card-slider-button-offset`        | `--space-3`                          | `16px`                               | Slider nav button offset           |
| `--room-card-slider-button-hover-bg`      | `--room-card-slider-button-bg`        | `rgba(0, 0, 0, 0)`                   | Slider nav button hover background |
| `--room-card-slider-button-hover-color`   | `--room-card-slider-button-color`     | `#ffffff`                            | Slider nav button hover color      |
| `--room-card-slider-indicator-size`       |                                      | `6px`                                | Slider indicator dot size          |
| `--room-card-slider-indicator-gap`        |                                      | `5px`                                | Gap between indicator dots         |
| `--room-card-slider-indicator-color`      | `--room-card-slider-button-color`     | `#ffffff`                            | Indicator dot color                |
| `--room-card-slider-indicator-box-shadow` |                                      | `0 0 0 1px rgba(0, 0, 0, 0.1)`       | Indicator dot shadow               |
| `--room-card-slider-360-pos-right`        | `--space-3`                          | `16px`                               | 360° link right offset             |
| `--room-card-slider-360-pos-top`          | `--space-3`                          | `16px`                               | 360° link top offset               |
| `--room-card-slider-360-color`            | `--room-card-slider-button-color`     | `#ffffff`                            | 360° link text color               |
| `--room-card-slider-360-bg`               | `--room-card-slider-button-bg`        | `rgba(0, 0, 0, 0)`                   | 360° link background               |
| `--room-card-slider-360-font-size`        |                                      | `0.875rem`                           | 360° link font size                |
| `--room-card-slider-360-padding`          | `--space-1` `--space-2`              | `4px 8px`                            | 360° link padding                  |
| `--room-card-slider-360-radius`           | `--space-1`                          | `4px`                                | 360° link border radius            |
| `--room-card-slider-360-hover-color`      | `--room-card-slider-button-hover-color`| `#ffffff`                           | 360° link hover color              |
| `--room-card-slider-360-hover-bg`         | `--room-card-slider-button-hover-bg`  | `rgba(0, 0, 0, 0)`                   | 360° link hover background         |
| `--room-card-slider-360-icon-size`        | `--space-4`                          | `24px`                               | 360° icon size                     |
| `--room-card-image-padding`               |                                      | `0`                                  | Image padding in slider            |
| `--room-card-image-aspect-ratio`          |                                      | `16 / 9`                             | Image aspect ratio                 |
| `--room-card-content-padding`             | `--space-3` `--space-2`              | `16px 8px`                           | Content area padding               |
| `--room-card-content-font-size`           |                                      | `0.875rem`                           | Content font size                  |
| `--room-card-content-gap`                 | `--space-2`                          | `8px`                                | Gap between content blocks         |
| `--room-card-title-font-size`             |                                      | `1.125rem`                           | Title font size                    |
| `--room-card-title-font-family`           | `--room-card-font-family`             | `Arial, sans-serif`                  | Title font family                  |
| `--room-card-title-font-weight`           |                                      | `bold`                               | Title font weight                  |
| `--room-card-title-color`                 | `--room-card-text-color`              | `#000`                               | Title color                        |
| `--room-card-title-padding`               |                                      | `0`                                  | Title padding                      |
| `--room-card-description-font-size`       | `--room-card-content-font-size`       | `0.875rem`                           | Description font size              |
| `--room-card-description-color`           | `--room-card-text-color`              | `#000`                               | Description color                  |
| `--room-card-description-padding`         |                                      | `0`                                  | Description padding                |
| `--room-card-description-line-height`     |                                      | `1.42`                               | Description line height            |
| `--room-card-extras-color`                |                                      | `#666`                               | Extras text color                  |
| `--room-card-extras-padding`              |                                      | `0`                                  | Extras padding                     |
| `--room-card-divider-color`               |                                      | `#e0e0e0`                            | Divider color for extras/amenities |
| `--room-card-extras-button-radius`        | `--space-1`                          | `4px`                                | Extras button border radius        |
| `--room-card-extras-hover-color`          | `--room-card-text-color`              | `#000`                               | Extras hover color                 |
| `--room-card-extras-hover-bg`             |                                      | `rgba(0, 0, 0, 0.1)`                 | Extras hover background            |
| `--room-card-amenities-color`             | `--room-card-text-color`              | `#000`                               | Amenities text color               |
| `--room-card-amenities-font-size`         | `--room-card-content-font-size`       | `0.875rem`                           | Amenities font size                |
| `--room-card-amenities-title-font-weight` |                                      | `normal`                             | Amenities title font weight        |
| `--room-card-amenities-list-columns`      |                                      | `2`                                  | Amenities list columns             |
| `--room-card-amenities-list-column-gap`   | `--space-4`                          | `24px`                               | Amenities list column gap          |
| `--room-card-amenities-list-padding-left` | `--space-3`                          | `16px`                               | Amenities list left padding        |
| `--room-card-amenities-list-dot-size`     | `--space-1`                          | `4px`                                | Amenities list dot size            |
| `--room-card-amenities-list-dot-top`      |                                      | `6px`                                | Amenities list dot top offset      |

#### Spacing scale

| Variable    | Value  | Description      |
| ----------- | ------ | ---------------- |
| `--space-1` | `4px`  | Smallest spacing |
| `--space-2` | `8px`  | Small spacing    |
| `--space-3` | `16px` | Medium spacing   |
| `--space-4` | `24px` | Large spacing    |
| `--space-5` | `32px` | X-large spacing  |
| `--space-6` | `48px` | XX-large spacing |
| `--space-7` | `64px` | Huge spacing     |
| `--space-8` | `80px` | Largest spacing  |

#### Spacing variables

| Variable    | Desktop | Mobile | Description      |
| ----------- | ------- | ------ | ---------------- |
| `--space-1` | `4px`   | `4px`  | Smallest spacing |
| `--space-2` | `8px`   | `8px`  | Small spacing    |
| `--space-3` | `16px`  | `12px` | Medium spacing   |
| `--space-4` | `24px`  | `18px` | Large spacing    |
| `--space-5` | `32px`  | `24px` | X-large spacing  |
| `--space-6` | `48px`  | `36px` | XX-large spacing |
| `--space-7` | `64px`  | `48px` | Huge spacing     |
| `--space-8` | `80px`  | `60px` | Largest spacing  |

You can override these variables in your CSS to customize the look and feel of the room card.

