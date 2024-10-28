# IRNMNLocation Component

**Version:** 1.0

The `IRNMNLocation` web component provides a dynamic location selector integrated with form submission. It allows users to choose a location from a dropdown, which can be populated via a `locations` attribute containing a JSON string. The component also updates other form elements with location-specific data, allowing easy synchronization of location-based information within a form.

## Attributes
The following attributes can be added to the `IRNMNLocation` element to customize its behavior:

| Attribute          | Description                                                   | Default Value                |
|--------------------|---------------------------------------------------------------|------------------------------|
| `locations`        | A JSON string representing the array of location objects.      | `[]` (empty array)            |
| `label`            | The label displayed above the dropdown.                       | `Select Location`             |
| `id`               | The ID for the location select element.                       | `irnmn-location-select`       |
| `name`             | The name for the location select element.                     | `location`                    |
| `placeholder`      | Placeholder text for the location dropdown.                   | `Select a location`           |
| `error-message`    | The message displayed when no valid location is selected.      | `Please select a valid location` |

## Methods
The following methods are exposed by the component for internal logic and can be extended if needed:

- `render()`: Renders the location dropdown UI, dynamically creating `data-*` attributes for each location from the provided JSON.
- `attachEventListeners()`: Attaches change event listeners to the location dropdown to handle selection changes.
- `handleLocationChange(event)`: Handles the change event for the location select, displaying an error message if no valid location is selected, and updating other form elements based on the selected location’s attributes.
- `updateOtherComponents(selectedLocation)`: Updates form components based on the selected location’s attributes using custom `data-*` attributes.

## Event Handling
The component listens for changes in the dropdown and updates other form components based on the selected location's properties, ensuring that the correct data is propagated across the form.

## Usage

Here’s an example of how to use the `IRNMNLocation` component in your HTML:

```html
<irnmn-location 
    locations='[{"hotelCode": "H001", "name": "Hotel One", "roomsNumber": 5}, {"hotelCode": "H002", "name": "Hotel Two", "roomsNumber": 10}]'
    label="Choose a Hotel"
    id="hotel-select"
    name="hotel"
    placeholder="Select your hotel"
    error-message="You must select a valid hotel!">
</irnmn-location>
```

In this example, the `locations` attribute contains a JSON string that defines multiple locations, each with attributes such as `hotelCode`, `name`, and `roomsNumber`. The dropdown is rendered dynamically based on this data.

## Behavior

- **Dynamic Data Attributes**: The component automatically generates `data-*` attributes for each location based on the keys in the provided location objects. For example, a location object with properties like `hotelCode`, `roomsNumber`, and `name` will create corresponding `data-hotel-code`, `data-rooms-number`, and `data-name` attributes in the dropdown options.
- **Form Synchronization**: When a location is selected, the component updates other elements in the form based on the selected location’s attributes. This ensures that the form stays in sync with the selected location’s data.

## Error Handling
If an invalid or empty location is selected, the component will display an error message (which can be customized using the `error-message` attribute). The component also logs errors if the `locations` attribute contains invalid JSON or if the required `locations` attribute is missing.
