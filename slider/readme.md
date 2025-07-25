# IRNMNSlider Component

**Version:** 1.0

The `IRNMNSlider` web component is a dynamic, accessible, and responsive slider supporting touch gestures, mouse dragging, keyboard navigation, and seamless looping. It is highly customizable via the `selectors` attribute, allowing you to define class names for internal elements.

---

## Attributes

| Attribute      | Description                                                                                      | Default Value                |
|----------------|--------------------------------------------------------------------------------------------------|------------------------------|
| `selectors`    | A JSON string that defines the class names for key slider elements.                              | N/A (required)               |
| `transition`   | The CSS transition for slide movement. Automatically disables for users preferring reduced motion.| `0.3s ease`                  |

### Example `selectors` JSON

```json
{
    "SWIPE_CONTAINER": ".slider-container",
    "SLIDES": ".slider-slide",
    "NAVIGATION": ".slider-navigation",
    "PREV_BUTTON": ".slider-prev",
    "NEXT_BUTTON": ".slider-next",
    "CURRENT_SLIDE": ".current-slide",
    "TOTAL_SLIDES": ".total-slides"
}
```

---

## Accessibility

- Adds an `aria-live` region for announcing slide changes.
- Sets ARIA roles and labels for slides and navigation.
- Keyboard navigation: supports Arrow keys, Home/End, and focus management.
- Cloned slides are hidden from assistive technologies.

---

## Methods

| Method                     | Description                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `selectors`                | Returns an object containing the class names for internal elements, as defined in the `selectors` attribute.            |
| `transition`               | Returns the transition string, disables transition for users with reduced motion preference.                            |
| `initSlider()`             | Initializes the slider, sets up accessibility, clones slides for looping, calculates offsets, and adds event listeners. |
| `setupResizeListener()`    | Adds a debounced window resize listener to recalculate slide offsets and center the current slide.                      |
| `renderSingleSlide()`      | Handles the case when only one slide is present: centers the slide and removes navigation controls.                     |
| `cloneSlides()`            | Clones the first and last slides to enable seamless looping.                                                            |
| `calculateSlideOffsets()`  | Calculates cumulative offsets for all slides based on their widths.                                                     |
| `updateTotalSlides()`      | Updates the total slides count in the UI.                                                                               |
| `initializePosition()`     | Sets the initial slider position and centers the first slide.                                                           |
| `addEventListeners()`      | Adds navigation, drag, and keyboard event listeners.                                                                    |
| `addListener()`            | Adds an event listener and tracks it for cleanup.                                                                       |
| `centerSlide()`            | Centers the currently active slide in the viewport.                                                                     |
| `initSlidesAttributes()`   | Sets ARIA and accessibility attributes for slides, hiding clones from assistive tech.                                   |
| `updateSlidesAttributes()` | Updates accessibility attributes and active state for each slide.                                                       |
| `updateSlides()`           | Updates slide position, pagination, accessibility, and dispatches a `slideChange` event.                                |
| `resetPosition()`          | Resets the slider position after a transition, handling looping and focus.                                              |
| `moveToNextSlide()`        | Moves to the next slide, handling looping and transitions.                                                              |
| `moveToPrevSlide()`        | Moves to the previous slide, handling looping and transitions.                                                          |
| `setupDragAndDrop()`       | Adds touch and mouse drag event listeners for slide navigation.                                                         |
| `refresh()`                | Recalculates slide offsets and centers the current slide (use after dynamic content changes).                           |

---

## Behavior

### 1. **Seamless Looping**
Clones the first and last slides for infinite loop effect. Clones are hidden from screen readers.

### 2. **Touch, Drag, and Keyboard Support**
Supports touch gestures, mouse dragging, and keyboard navigation (Arrow keys, Home/End).

### 3. **Dynamic Adjustments**
Dynamically adjusts slide widths and offsets on window resize (debounced for performance).

### 4. **Accessibility**
Announces slide changes, manages focus, and sets ARIA attributes for slides and navigation.

### 5. **Single Slide Handling**
If only one slide is present, navigation controls are removed and the slide is centered.

### 6. **Custom Events**
Dispatches a `slideChange` event on slide change with details about the current slide.

---

## Usage

```html
<irnmn-slider selectors='{
    "SWIPE_CONTAINER": ".slider-container",
    "SLIDES": ".slider-slide",
    "NAVIGATION": ".slider-navigation",
    "PREV_BUTTON": ".slider-prev",
    "NEXT_BUTTON": ".slider-next",
    "CURRENT_SLIDE": ".current-slide",
    "TOTAL_SLIDES": ".total-slides"
}'>
    <div class="slider-container">
        <div class="slider-slide">Slide 1</div>
        <div class="slider-slide">Slide 2</div>
        <div class="slider-slide">Slide 3</div>
    </div>
    <div class="slider-navigation">
        <button class="slider-prev">Previous</button>
        <span>
            <span class="current-slide">1</span> /
            <span class="total-slides">3</span>
        </span>
        <button class="slider-next">Next</button>
    </div>
</irnmn-slider>
```

---

## Features

- **Looping:** Clones slides for seamless infinite navigation.
- **Swipe & Drag:** Touch and mouse drag support.
- **Keyboard Navigation:** Arrow keys, Home/End, focus management.
- **Accessibility:** ARIA roles, live region, focus handling, clones hidden from screen readers.
- **Responsive:** Adjusts slide widths and offsets on resize.
- **Custom Events:** Dispatches `slideChange` event on slide change.
- **Debugging:** Add `?debugTracking=true` to the URL for console logs.

---

## Example Selectors

```json
{
    "SWIPE_CONTAINER": "wp-block-custom21c-gallery--images",
    "SLIDES": "wp-block-custom21c-gallery--image",
    "NAVIGATION": "slideshow-navigation",
    "PREV_BUTTON": "prev",
    "NEXT_BUTTON": "next",
    "CURRENT_SLIDE": "current-slide",
    "TOTAL_SLIDES": "total-slides"
}
```

---

## Notes

- If only one slide is present, navigation controls are removed and the slide is centered.
- For debugging, add `?debugTracking=true` to the URL to enable console logs.
- To refresh the slider after dynamic content changes, call the `refresh()` method.
- All event listeners are cleaned up automatically when the component is removed from the DOM.

