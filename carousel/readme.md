# IRNMNCarousel

`<irnmn-carousel>` is a **scroll-snap based, variable-width carousel Web Component**.

It relies on **native scrolling + CSS scroll-snap** and adds a logical navigation layer on top: buttons, keyboard support, RTL normalization, pager handling (slides or pages), and accessible announcements.

The component is intentionally **layout-agnostic**: it does not impose markup or styles beyond what it queries via selectors.

---

## Features

- Native horizontal scrolling with CSS `scroll-snap`
- Variable-width slides
- **Active slide = closest left snap point**
- When reaching physical scroll end, **last slide becomes active** (logical)
- Prev / Next navigation with a virtual **END step** (`maxScroll`)
- Pager modes:
  - `slides` → slide-based indexing
  - `pages` → virtual page indexing
- RTL scroll normalization (Chrome / Safari / Firefox models)
- Keyboard support: Arrow keys, Home / End
- `aria-live` announcements (polite)
- Resize-aware (recomputes geometry on resize)
- Public API for refresh / navigation
- Emits a `carouselChange` event on active change

---

## Expected markup

The component discovers its internal elements through a `selectors` attribute (JSON).

Example:

```html
<irnmn-carousel
  pager-mode="slides"
  selectors='{
    "viewport": ".carousel__viewport",
    "slides": ".carousel__slide",
    "prev_button": ".carousel__prev",
    "next_button": ".carousel__next",
    "current_slide": ".carousel__current",
    "total_slides": ".carousel__total"
  }'
>
  <button class="carousel__prev" type="button">Prev</button>
  <button class="carousel__next" type="button">Next</button>

  <div class="carousel__viewport">
    <div class="carousel__slide">Slide 1</div>
    <div class="carousel__slide">Slide 2</div>
    <div class="carousel__slide">Slide 3</div>
  </div>

  <div class="carousel__pager" aria-hidden="true">
    <span class="carousel__current">1</span> /
    <span class="carousel__total">0</span>
  </div>
</irnmn-carousel>
```

---

## Required CSS (minimum)

You are responsible for applying scroll-snap and layout styles.

```css
.carousel__viewport {
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  gap: 16px; /* used internally for epsilon heuristics */
  scroll-padding-left: 0px;
  scroll-padding-right: 0px;
}

.carousel__slide {
  flex: 0 0 auto;
  scroll-snap-align: start;
}
```

Optional: hide controls when the carousel is not overflowing.

```css
irnmn-carousel:not(.is-overflowing) .carousel__prev,
irnmn-carousel:not(.is-overflowing) .carousel__next {
  display: none;
}
```

---

## Configuration

### `selectors` (attribute)

JSON mapping internal roles to CSS selectors.

Supported keys:

- `viewport` (required)
- `slides`
- `prev_button`
- `next_button`
- `current_slide`
- `total_slides`

---

### `pager-mode` (attribute)

- `slides`
- `pages`

---

## Behavior notes

### Active slide logic

- During scrolling, the component computes a logical scroll position (normalized for RTL)
- It picks the closest snap position (`snapLefts`) as the active index
- If the viewport is at physical end, it forces the last slide as active

### Prev/Next logic (virtual END)

- Next: goes to the next snap point; if none exists, goes to `maxScroll`
- Prev: goes to the previous snap point; when at end, it treats the current position as slightly *past* `maxScroll` so it can step back

### RTL support

RTL is detected from `getComputedStyle(viewport).direction`.
The component normalizes to a logical scroll space `0 → maxScroll` regardless of browser RTL scroll model:

- Chrome/Safari: `scrollLeft` is negative in RTL (`0 → -maxScroll`)
- Firefox: `scrollLeft` is reversed (`maxScroll → 0`)
- Rare: default (`0 → maxScroll`)

## Keyboard support

When the viewport (or any element inside the component) is focused:

- `ArrowRight` / `ArrowLeft` navigates (mirrored in RTL)
- `Home` goes to the start
- `End` goes to the end

Keyboard navigation is ignored when focus is inside `input`, `textarea`, or `select`.

---

## Events

### `carouselChange`

Dispatched on the host (`<irnmn-carousel>`) when the active slide changes.

```js
carousel.addEventListener('carouselChange', (e) => {
  const { currentIndex, currentElement, total } = e.detail;
});
```

---

## Public API

### `refresh()`
### `next()`
### `prev()`

```js
carousel.refresh();
carousel.next();
carousel.prev();
```

---
## Debugging

Add `?debugCarousel=1` to the URL to enable console logging.

## Implementation notes / known sensitivities

- Snap calculations rely on `getBoundingClientRect()` and current scroll position; heavy layout shifts during smooth scrolling can cause transient snap noise.
- RTL scroll type detection temporarily writes to `scrollLeft` to detect the browser model.
