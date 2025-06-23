# IRNMN Room Card

A custom web component for displaying hotel room information, images, amenities, and pricing in a card format.

## Features

- Responsive image slider with navigation and optional 360° tour link
- Room and hotel amenities display (with customizable section titles)
- Room extras and description
- Modal with expanded room details and amenities
- Customizable labels for accessibility and localization
- Integrated "Book" button (label customizable)
- Unique modal per card for accessibility

## Usage

```html
<irnmn-room-card
    room-code="DELUXE"
    title="Deluxe Room"
    description="A spacious room with sea view."
    images='[
        "/img/room1.jpg",
        {"url": "/img/room2.jpg", "alt": "Second view"}
    ]'
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
        "hotelAmenities": "Hotel Amenities",
        "close": "Close",
        "book": "Book Now"
    }'
></irnmn-room-card>
```

## Attributes

| Attribute            | Type    | Description                                                                 |
|----------------------|---------|-----------------------------------------------------------------------------|
| `room-code`          | String  | Room code identifier                                                        |
| `title`              | String  | Room title                                                                  |
| `description`        | String  | Room description                                                            |
| `images`             | JSON    | Array of image URLs (string) or objects (`{url, alt}`)                      |
| `extras`             | JSON    | Array of extra features                                                     |
| `room-amenities`     | JSON    | Array of room amenities                                                     |
| `hotel-amenities`    | JSON    | Array of hotel amenities                                                    |
| `link-360`           | String  | URL to 360° tour (optional)                                                 |
| `labels`             | JSON    | Object for custom labels and accessibility (`prevSlide`, `nextSlide`, `view360`, `more`, `roomAmenities`, `hotelAmenities`, `close`, `book`) |

### Images attribute

- Accepts an array of strings (image URLs) or objects with `url` and optional `alt` for accessibility.

### Modal

- Clicking the "More info" button opens a modal with expanded details, amenities, and a larger slider.
- The modal close button label can be customized via `labels.close`.
- Each card instance has a unique modal for accessibility.

### Accessibility & Localization

- All navigation and action buttons have accessible labels, which can be customized via the `labels` attribute.
- The "Book" button label can be customized via `labels.book`.

### Dependencies

- Requires the `<irnmn-slider>` and `<irnmn-modal>` custom elements.

## Styling

Styling is handled via CSS and CSS variables. See the CSS section for details.


## Styling

### CSS Variables

You can customize the appearance using these CSS variables:

#### Spacing scale

| Variable    | Default Value | Description      |
| ----------- | ------------- | ---------------- |
| `--space-1` | `4px`         | Smallest spacing |
| `--space-2` | `8px`         | Small spacing    |
| `--space-3` | `16px`        | Medium spacing   |
| `--space-4` | `24px`        | Large spacing    |
| `--space-5` | `32px`        | X-large spacing  |
| `--space-6` | `48px`        | XX-large spacing |
| `--space-7` | `64px`        | Huge spacing     |
| `--space-8` | `80px`        | Largest spacing  |

#### Room card

| Variable                  | Default Value       | Description           |
| ------------------------- | ------------------- | --------------------- |
| `--room-card-bg`          | `#ffffff`           | Card background color |
| `--room-card-padding`     | `0px`               | Card padding          |
| `--room-card-font-family` | `Arial, sans-serif` | Font family for card  |
| `--room-card-text-color`  | `#000`              | Main text color       |

#### Slider

| Variable                                 | Default Value                          | Description                        |
| ---------------------------------------- | -------------------------------------- | ---------------------------------- |
| `--room-card-slider-width`               | `100%`                                 | Slider width                       |
| `--room-card-slider-border-radius`       | `0px`                                  | Slider border radius               |
| `--room-card-slider-button-bg`           | `rgba(0, 0, 0, 0)`                     | Slider nav button background       |
| `--room-card-slider-button-color`        | `#ffffff`                              | Slider nav button color            |
| `--room-card-slider-control-button-size` | `40px`                                 | Slider nav button size             |
| `--room-card-slider-button-radius`       | `50%`                                  | Slider nav button border radius    |
| `--room-card-slider-button-offset`       | `var(--space-3)`                       | Slider nav button offset           |
| `--room-card-slider-button-hover-bg`     | `var(--room-card-slider-button-bg)`    | Slider nav button hover background |
| `--room-card-slider-button-hover-color`  | `var(--room-card-slider-button-color)` | Slider nav button hover color      |

#### Slider indicators

| Variable                                  | Default Value                          | Description                |
| ----------------------------------------- | -------------------------------------- | -------------------------- |
| `--room-card-slider-indicator-size`       | `6px`                                  | Slider indicator dot size  |
| `--room-card-slider-indicator-gap`        | `5px`                                  | Gap between indicator dots |
| `--room-card-slider-indicator-color`      | `var(--room-card-slider-button-color)` | Indicator dot color        |
| `--room-card-slider-indicator-box-shadow` | `0 0 0 1px rgba(0, 0, 0, 0.1)`         | Indicator dot shadow       |

#### Slider 360

| Variable                             | Default Value                                | Description                |
| ------------------------------------ | -------------------------------------------- | -------------------------- |
| `--room-card-slider-360-pos-right`   | `var(--space-3)`                             | 360° link right offset     |
| `--room-card-slider-360-pos-top`     | `var(--space-3)`                             | 360° link top offset       |
| `--room-card-slider-360-color`       | `var(--room-card-slider-button-color)`       | 360° link text color       |
| `--room-card-slider-360-bg`          | `var(--room-card-slider-button-bg)`          | 360° link background       |
| `--room-card-slider-360-font-size`   | `0.875rem`                                   | 360° link font size        |
| `--room-card-slider-360-padding`     | `var(--space-1) var(--space-2)`              | 360° link padding          |
| `--room-card-slider-360-radius`      | `var(--space-1)`                             | 360° link border radius    |
| `--room-card-slider-360-hover-color` | `var(--room-card-slider-button-hover-color)` | 360° link hover color      |
| `--room-card-slider-360-hover-bg`    | `var(--room-card-slider-360-bg)`             | 360° link hover background |
| `--room-card-slider-360-icon-size`   | `var(--space-4)`                             | 360° icon size             |

#### Image

| Variable                         | Default Value | Description             |
| -------------------------------- | ------------- | ----------------------- |
| `--room-card-image-padding`      | `0`           | Image padding in slider |
| `--room-card-image-aspect-ratio` | `16 / 9`      | Image aspect ratio      |

#### Content

| Variable                        | Default Value | Description       |
| ------------------------------- | ------------- | ----------------- |
| `--room-card-content-font-size` | `0.875rem`    | Content font size |

#### Title

| Variable                        | Default Value                  | Description       |
| ------------------------------- | ------------------------------ | ----------------- |
| `--room-card-title-font-size`   | `1.125rem`                     | Title font size   |
| `--room-card-title-font-family` | `var(--room-card-font-family)` | Title font family |
| `--room-card-title-font-weight` | `bold`                         | Title font weight |
| `--room-card-title-color`       | `var(--room-card-text-color)`  | Title color       |
| `--room-card-title-padding`     | `0`                            | Title padding     |

#### Description

| Variable                              | Default Value                        | Description             |
| ------------------------------------- | ------------------------------------ | ----------------------- |
| `--room-card-description-color`       | `var(--room-card-text-color)`        | Description color       |
| `--room-card-description-padding`     | `0`                                  | Description padding     |
| `--room-card-description-line-height` | `1.42`                               | Description line height |

#### Extras

| Variable                           | Default Value                 | Description                        |
| ---------------------------------- | ----------------------------- | ---------------------------------- |
| `--room-card-extras-color`         | `#666`                        | Extras text color                  |
| `--room-card-extras-padding`       | `0`                           | Extras padding                     |
| `--room-card-divider-color`        | `#e0e0e0`                     | Divider color for extras/amenities |
| `--room-card-extras-button-radius` | `var(--space-1)`              | Extras button border radius        |
| `--room-card-extras-hover-color`   | `var(--room-card-text-color)` | Extras hover color                 |
| `--room-card-extras-hover-bg`      | `rgba(0, 0, 0, 0.1)`          | Extras hover background            |

#### Amenities

| Variable                                  | Default Value                        | Description                   |
| ----------------------------------------- | ------------------------------------ | ----------------------------- |
| `--room-card-amenities-color`             | `var(--room-card-text-color)`        | Amenities text color          |
| `--room-card-amenities-list-columns`      | `2`                                  | Amenities list columns        |
| `--room-card-amenities-list-column-gap`   | `var(--space-4)`                     | Amenities list column gap     |
| `--room-card-amenities-list-padding-left` | `var(--space-3)`                     | Amenities list left padding   |
| `--room-card-amenities-list-dot-size`     | `var(--space-1)`                     | Amenities list dot size       |
| `--room-card-amenities-list-dot-top`      | `calc(var(--space-1) * 1.5)`         | Amenities list dot top offset |

#### Modal

| Variable                   | Default Value                 | Description              |
| -------------------------- | ----------------------------- | ------------------------ |
| `--room-modal-bg`          | `#ffffff`                     | Modal background color   |
| `--room-modal-width`       | `100%`                        | Modal width              |
| `--room-modal-max-width`   | `870px`                       | Modal max width          |
| `--room-modal-backdrop`    | `rgba(0, 0, 0, 0.25)`         | Modal backdrop color     |
| `--room-modal-close-color` | `var(--room-card-text-color)` | Modal close button color |

#### CTA

| Variable                        | Default Value                        | Description                |
| ------------------------------- | ------------------------------------ | -------------------------- |
| `--room-card-cta-color`         | `#fff`                               | CTA button text color      |
| `--room-card-cta-bg`            | `#000`                               | CTA button background      |
| `--room-card-cta-border`        | `none`                               | CTA button border          |
| `--room-card-cta-hover-color`   | `var(--room-card-cta-bg)`            | CTA hover text color       |
| `--room-card-cta-hover-bg`      | `var(--room-card-cta-color)`         | CTA hover background       |
| `--room-card-cta-hover-border`  | `none`                               | CTA hover border           |
| `--room-card-cta-radius`        | `var(--space-1)`                     | CTA button border radius   |
| `--room-card-cta-font-size`     | `var(--room-card-content-font-size)` | CTA button font size       |

### Specific customization

For very specific customization not covered in the variables, you can target these classes to apply custom styles:

- `.room-card`
- `.room-card__slider`
- `.room-card__slider-container`
- `.room-card__slider-slide`
- `.room-card__slider-navigation`
- `.room-card__slider-prev`
- `.room-card__slider-next`
- `.room-card__slider-indicators`
- `.room-card__slider-360`
- `.room-card__content`
- `.room-card__title`
- `.room-card__extras`
- `.room-card__description`
- `.room-card__amenities`
- `.room-card__amenities-title`
- `.room-card__amenities-list`
- `.room-modal`
- `.room-modal__inner`
- `.room-modal__header`
