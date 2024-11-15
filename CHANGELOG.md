# Changelog

All new releases are documented in this file. The semantic versioning should follow these parameters:

## [Release version] - [Date YYYY-MM-DD]
### [Added/Changed/Fixed/Removed] - [component]
- Description of the changes

------

## v1.1.1
### Fixed - irnmn-location
- Update other components based on the locations key selected by the user
- Turn the hidden field required as default

### Changed - irnmn-guests-summary
- Added new option to display the sum of the guests (adults + children)
- Optimize the HTML summary rendering using an external method (appendSummary)

### Changed - irnmn-select
- Listen "Enter" button to open/close the dropdown

### Fixed - irnmn-calendar
- Add extra classes to determine if the calendar should be render at the top/bottom of the calendar input

## v1.1.0
### Added - irnmn-guests-summary
- Added dispatchSyncEvent logic to the component to trigger changes on storageKey

### Fixed - irnmn-location
- Change the output to be used the irnmn-select instead of the native browser dropdown

## v1.0.6
### Fixed - irnmn-calendar
- Make opening day selectable

## v1.0.5
### Fixed - irnmn-calendar
- Create disabled buttons to fix week days offset

## v1.0.4
### Fixed - irnmn-guests-selector
- Change select name from "rooms" to "rooms-total" to avoid conflicts when passing form data to BE

## v1.0.3
### fixed - irnmn-calendar, irnmn-number-picker
- Fix accessibility issues :
  - keyboard navigation for irnmn-calendar
  - aria labels for irnmn-number-picker
- Fix irnmn-calendar close panel on click ouside
- Improve irnmn-calendar to handle in-range days on hover / focus

## v1.0.2
### Fixed - irnmn-guests-selector
- The non-compatible inline if statements

## v1.0.1
### Added - irnmn-video, irnmn-calendar, irnmn-guests-selector, irnmn-location, irnmn-number-picker, irnmn-rooms-selector, irnmn-select, irnmn-text
- First release with the irnmnm components
