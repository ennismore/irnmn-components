# IRNMNCalendar Component

**Version:** 1.0

Web component that provides a fully interactive date selection interface with a months' selector. It supports date range selection with check-in and check-out dates, handles session storage, and includes custom event synchronization across multiple instances.

## Attributes
The following attributes can be added to the `IRNMNCalendar` element to customize its behavior:

| Attribute                | Description                                                        | Default Value         |
|--------------------------|--------------------------------------------------------------------|----------------------|
| `label`                  | The label displayed above the input field.                         | `Check-in`           |
| `placeholder`            | Placeholder text for the input field.                             | `Select a date`      |
| `name`                   | Unique name identifier for the calendar component.                | `irnmn-calendar`     |
| `open-date`               | The starting date for the calendar (initial view).                | `Date.now()`         |
| `checkin-date-name`      | Name for the hidden check-in date input field.                    | `startDate`          |
| `checkout-date-name`     | Name for the hidden check-out date input field.                   | `endDate`            |
| `weekdays`               | Comma-separated list of weekday names (e.g., `Mon,Tue,...`).      | Disabled by default  |
| `date-locale`               | The date format      | en-GB default  |

## Methods
The following methods are exposed by the component for internal logic and can be extended if needed:

- `render()`: Renders the calendar UI and injects the external CSS.
- `loadMonthButtons()`: Loads the month buttons into the carousel structure.
- `toggleCalendar()`: Opens or closes the calendar.

## Calendar Sync
The component supports synchronization across multiple instances using custom events. This ensures that changes made in one instance of the calendar are reflected in all others that share the same `name` attribute.

## Events
The following custom events are emitted by the calendar component:
- `checkin-selected-[name]`: Fired when a check-in date is selected, where `[name]` is the value of the `name` attribute.
- `checkout-selected-[name]`: Fired when a check-out date is selected, where `[name]` is the value of the `name` attribute.

### Example
To listen for these events in your application, use the following pattern:
```javascript
document.addEventListener('checkin-selected-irnmn-calendar', (event) => {
    console.log('Check-in date selected:', event.detail);
});
```

## Behavior
### Carousel Functionality
- The calendar now features a month-by-month carousel with navigation arrows (`◀` and `▶`) to scroll through the months.
- Only one month is displayed at a time, enhancing the user experience.
- Smooth transitions are provided between months.

### CSS Injection
- External CSS is dynamically loaded and injected directly into the component using the `loadAndInjectCSS` utility.
- This ensures that styles are applied consistently and allows for easy updates to the CSS.

## Accessibility
- **ARIA Roles**: The component uses ARIA roles such as `role="region"`, `role="grid"`, and `role="columnheader"` to enhance screen reader compatibility.
- **Keyboard Navigation**: The calendar supports keyboard interactions, allowing users to navigate and select dates using arrow keys.
- **Focus Management**: The calendar properly manages focus when opened and closed, ensuring a seamless experience for keyboard users.

## Usage

Here's an example of how to use the `IRNMNCalendar` component in your HTML:

```html
<irnmn-calendar 
    label="Select Your Dates"
    placeholder="Choose a date"
    name="booking-calendar"
    open-date="2024-01-01"
    checkin-date-name="start-date"
    checkout-date-name="end-date"
    weekdays="Mon,Tue,Wed,Thu,Fri,Sat,Sun">
</irnmn-calendar>
```

### JS example
To listen to the custom events emitted by the calendar, you can use the following JavaScript code:

```javascript
document.addEventListener('checkin-selected-booking-calendar', (event) => {
    console.log('Check-in date selected:', event.detail);
});

document.addEventListener('checkout-selected-booking-calendar', (event) => {
    console.log('Check-out date selected:', event.detail);
});
```
