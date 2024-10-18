# IRNMNSelect Component

**Version:** 1.0

The `<irnmn-select>` web component provides a flexible custom select interface with dropdown functionality, supporting preselected options, dynamic placeholders, and ARIA accessibility features.

## Attributes
The following attributes can be added to the `irnmn-select` element to customize its behavior:

| Attribute       | Description                                                      | Default Value       |
|-----------------|------------------------------------------------------------------|---------------------|
| `heading-text`  | Text displayed as the heading for the select dropdown.           | `Select an Option`  |
| `placeholder`   | First item text displayed when menu list is open.                | `""`                |
| `preselected`   | Sets the initially selected option from the available options.   | `null`              |
| `options`       | A JSON array of options with `name` and `value` properties.      | `[]`                |

## Methods
The component exposes the following methods for internal logic and user interaction:

- `toggleDropdown()`: Toggles the visibility of the options dropdown.
- `selectOption(value)`: Programmatically selects an option based on its value.
- `clearSelection()`: Clears the current selection, resetting to the placeholder state.

## Behavior
The `<irnmn-select>` component offers the following behavior:

- **Preselected Option**: If a `preselected` value is provided, the component automatically selects the corresponding option upon initialization.
- **Dynamic Placeholder**: When no option is selected, the placeholder text is displayed. Once an option is selected, it replaces the placeholder.
- **ARIA Accessibility**: The component uses appropriate ARIA roles and attributes to ensure compatibility with screen readers and other assistive technologies.

## Example

Here's an example of how to use the `irnmn-select` component in your HTML:

```html
<irnmn-select 
    class="location-select"
    id="location-select"
    aria-labelledby="location-label"
    heading-text="Please select" 
    placeholder="Go to" 
    preselected="Bentonville"
    options='[
        {"name":"Bentonville, Arkansas", "value":"Bentonville"}, 
        {"name":"Chicago, Illinois", "value":"Chicago"}, 
        {"name":"Cincinnati, Ohio", "value":"Cincinnati"}, 
        {"name":"Durham, North Carolina", "value":"Durham"}, 
        {"name":"Kansas City, Missouri", "value":"Kansas City"}, 
        {"name":"Lexington, Kentucky", "value":"Lexington"}, 
        {"name":"Louisville, Kentucky", "value":"Louisville"}, 
        {"name":"St. Louis, Missouri", "value":"St. Louis"}
    ]'>
</irnmn-select>
