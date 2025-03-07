# IRNMNGuestsSummary Component

**Version:** 1.0

The `IRNMNGuestsSummary` web component displays a dynamic summary of rooms, adults, and children based on session storage data. It automatically updates whenever changes are made to the selected session storageKey, providing a live summary of room and guest information.

## Attributes
The following attribute can be added to the `IRNMNGuestsSummary` element to customize its labels for rooms, adults, and children:

| Attribute         | Description                                                             | Default Values                                                 |
|-------------------|-------------------------------------------------------------------------|----------------------------------------------------------------|
| `labels`          | A JSON string containing the labels for rooms, adults, and children.    | `{ "room": "room", "rooms": "rooms", "adult": "adult", "adults": "adults", "child": "child", "children": "children" }` |
| `storage-key`     | The key in session storage where the room data is stored.               | `'irnmn-rooms'`                                                |
| `enable-children` | Boolean - to specify if children need to be counted in the total or not | `'irnmn-rooms'`                                                |

### Labels JSON Structure
The `labels` attribute should be provided as a JSON string with the following possible keys:

- `room`: Singular label for "room".
- `rooms`: Plural label for "rooms".
- `adult`: Singular label for "adult".
- `adults`: Plural label for "adults".
- `child`: Singular label for "child".
- `children`: Plural label for "children".

**Example JSON for Labels**:

    {
        "room": "suite",
        "rooms": "suites",
        "adult": "person",
        "adults": "people",
        "child": "youngster",
        "children": "youngsters"
    }

## Methods
The following methods manage the component’s behavior, rendering, and state synchronization:

- **`loadLabels()`**: Parses the `labels` attribute JSON, merging it with default labels for any missing entries.
- **`loadInitialState()`**: Loads initial data from session storage, if available, to populate the summary on page load.
- **`updateSummary(event)`**: Updates the summary based on the custom `'irnmn-rooms-updated'` event, ensuring that any changes to the `irnmn-rooms` session storage key are reflected in real time.
- **`updateSummaryData(data)`**: Processes the provided room data to calculate separate counts for rooms, adults, and children.
- **`render()`**: Renders the summary display, showing only the labels and counts that have values (e.g., excluding children if there are none).

## Event Handling
The component listens for the `'irnmn-rooms-updated'` event, which is dispatched whenever the `'irnmn-rooms'` session storage data changes. This allows the component to stay in sync with other components that modify the room and guest data.

## Usage

Here’s an example of how to use the `IRNMNGuestsSummary` component in your HTML with custom labels:

```html
<irnmn-guests-summary
    storage-key="custom-storage-key"
    labels='{
        "room": "suite",
        "rooms": "suites",
        "adult": "person",
        "adults": "people",
        "child": "youngster",
        "children": "youngsters"
    }'>
</irnmn-guests-summary>
```

In this example, the component will use the custom labels specified in the JSON for rooms, adults, and children, and it will listen to changes from the session storage key `custom-storage-key`. The summary will dynamically update based on the data stored in session storage.

## Behavior

- **Dynamic Labeling**: The component allows flexible labeling for singular and plural forms of rooms, adults, and children. If no custom labels are provided in the `labels` JSON, default labels are used.
- **Conditional Display**: The summary text only includes rooms, adults, or children if their respective counts are greater than zero. For example, if there are no children, the summary will omit this part, rendering only the counts for rooms and adults.
