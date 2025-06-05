# IRNMNSelect Component

**Version:** 1.0

The `<irnmn-select>` web component provides a flexible custom select interface with dropdown functionality, supporting preselected options, dynamic placeholders, and ARIA accessibility features.

## Attributes
The following attributes can be added to the `irnmn-select` element to customize its behavior:

| Attribute                     | Description                                                      | Default Value       |
|-------------------------------|------------------------------------------------------------------|---------------------|
| `heading-text`                | Text displayed as the heading for the select dropdown.           | `Select an Option`  |
| `placeholder`                 | First item text displayed when menu list is open.                | `""`                |
| `preselected`                 | Sets the initially selected option from the available options.   | `null`              |
| `label-id`                    | Value of the aria-labelledby                                     | `null`              |
| `options`                     | A JSON array of options with `name` and `value` properties.      | `[]`                |
| `anchor-links`                | Boolean. Pass "true" as a text string to have a tags output      | `""`                |
| `use-native-select`           | To display the native select. Used on Hoxton, mobile view        | `false`             |
| `native-select-breakpoint`    | The breakpoint at which we display the native select.            | `768` (in pixels)   |

## Methods
The component exposes the following methods for internal logic and user interaction:

- `toggleDropdown()`: Toggles the visibility of the options dropdown.
- `selectOption(value)`: Programmatically selects an option based on its value.
- `clearSelection()`: Clears the current selection, resetting to the placeholder state.
- `getSelectableOptions()`: Returns a list of all selectable options within the dropdown.
- `findVisibleOptionIndex(startIndex, direction)`: Finds the index of the next visible option, starting from a given index and moving in the specified direction (1 for forward, -1 for backward).
- `findNextVisibleOptionIndex(currentIndex)`: Finds the index of the next visible option, starting from the current index and moving forward.
- `findPreviousVisibleOptionIndex(currentIndex)`: Finds the index of the previous visible option, starting from the current index and moving backward.
- `findFirstVisibleOptionIndex()`: Finds the index of the first visible option in the dropdown.
- `findLastVisibleOptionIndex()`: Finds the index of the last visible option in the dropdown.

## Behavior
The `<irnmn-select>` component offers the following behavior:

- **Preselected Option**: If a `preselected` value is provided, the component automatically selects the corresponding option upon initialization.
- **Dynamic Placeholder**: When no option is selected, the placeholder text is displayed. Once an option is selected, it replaces the placeholder.
- **ARIA Accessibility**: The component uses appropriate ARIA roles and attributes to ensure compatibility with screen readers and other assistive technologies.
- **Enhanced Focus and Navigation**: The component ensures that dynamically hidden options are skipped during focus and tabbing.

## Example

Here's an example of how to use the `irnmn-select` component in your HTML:

```html
<irnmn-select
    class="location-select"
    heading-text="Please select"
    placeholder="Go to"
    preselected="Bentonville"
    label-id="select-label"
    options='[
        {"name":"Bentonville, Arkansas", "value":"Bentonville"},
        {"name":"Chicago, Illinois", "value":"Chicago"},
        {"name":"Cincinnati, Ohio", "value":"Cincinnati"},
        {"name":"Durham, North Carolina", "value":"Durham"},
        {"name":"Kansas City, Missouri", "value":"Kansas City"},
        {"name":"Lexington, Kentucky", "value":"Lexington"},
        {"name":"Louisville, Kentucky", "value":"Louisville"},
        {"name":"St. Louis, Missouri", "value":"St. Louis"}
    ]'
    anchor-links=""
>
</irnmn-select>
