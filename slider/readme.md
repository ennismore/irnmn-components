# IRNMNSlider Component

**Version:** 1.0

The `IRNMNSlider` web component provides a dynamic and responsive slider that supports touch gestures, mouse dragging, and looping functionality. It is highly customizable using a `selectors` attribute, allowing you to dynamically define class names for internal elements.

---

## Attributes

The following attributes can be added to the `IRNMNSlider` element to customize its behavior:

| Attribute      | Description                                                                                      | Default Value                |
|----------------|--------------------------------------------------------------------------------------------------|------------------------------|
| `selectors`    | A JSON string that defines the class names for key slider elements.                              | N/A (required)               |

### Example `selectors` JSON

```json
{
    "SWIPE_CONTAINER": "slider-container",
    "SLIDES": "slider-slide",
    "NAVIGATION": "slider-navigation",
    "PREV_BUTTON": "slider-prev",
    "NEXT_BUTTON": "slider-next",
    "CURRENT_SLIDE": "current-slide",
    "TOTAL_SLIDES": "total-slides"
}
```

---

## Methods

The following methods are used internally to handle slider functionality and can be extended as needed:

### `selectors`
Returns an object containing the class names for internal elements, as defined in the `selectors` attribute.

### `initSlider()`
Initializes the slider. This includes:
- Cloning the first and last slides to enable seamless looping.
- Setting up event listeners for navigation, touch gestures, and drag events.
- Adjusting slide widths dynamically on window resize.

### `updateSlides()`
Updates the slide position using `transform: translateX()` and updates the current slide indicator.

### `resetPosition()`
Resets the position when the slider transitions to cloned slides, creating a seamless looping effect.

### `nextSlide()`
Moves to the next slide.

### `prevSlide()`
Moves to the previous slide.

---

## Behavior

### 1. **Seamless Looping**
The slider loops seamlessly by cloning the first and last slides. When navigating past the first or last slide, it resets the position to create an infinite loop effect.

### 2. **Touch and Drag Support**
The component supports touch gestures on mobile and drag events on desktop for smooth navigation.

### 3. **Dynamic Adjustments**
The slider dynamically adjusts the width of slides to match the container's size, ensuring responsiveness.

### 4. **Keyboard Navigation**
The component listens for click events on `prev` and `next` buttons, enabling navigation through slides.

---

## Usage

Here’s an example of how to use the `IRNMNSlider` component in your HTML:

```html
<irnmn-slider selectors='{
    "SWIPE_CONTAINER": "slider-container",
    "SLIDES": "slider-slide",
    "NAVIGATION": "slider-navigation",
    "PREV_BUTTON": "slider-prev",
    "NEXT_BUTTON": "slider-next",
    "CURRENT_SLIDE": "current-slide",
    "TOTAL_SLIDES": "total-slides"
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

## Example Selectors

### Default Selectors:
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

## Features

### **1. Looping**
The component clones the first and last slides to create a seamless looping effect.

### **2. Swipe and Drag**
Supports swipe gestures on touch devices and mouse dragging for desktop users.

### **3. Pagination**
Dynamically updates the pagination indicator to reflect the current slide.

### **4. Resizable**
Automatically adjusts the width of slides when the window resizes.
