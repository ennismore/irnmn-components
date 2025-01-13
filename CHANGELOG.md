# Changelog

All new releases are documented in this file. The semantic versioning should follow these parameters:

## [Release version] - [Date YYYY-MM-DD]
### [Added/Changed/Fixed/Removed] - [component]
- Description of the changes

------
## v1.1.4
### Added - irnmn-booking-all-com
- New component to handle form fields needed for redirecting to all.com
- More info on fields here: [All.com booking params](https://ennismore.atlassian.net/wiki/spaces/EW/pages/4037246977/All.com+-+booking+platform+parameters)

------
## v1.1.3
### Fixed - irnmn-slider
### Added - irnmn-slider
- Fix displaying current slide number on pagination
- Added a custom event "slideChange" to be catched outside of the component

## v1.1.2
### Fixed - irnmn-select
### Added - irnmn-slider
- Updated Location dropdown. Value in attribute "default" now has priority over sessionStorage value
- Fix accessibility issues :
  - Added label-id attribute
  - Moved role, aria-expanded, aria-haspopup and aria-labelledby attributes to header
  - Added helper functions to ensure only visible options are focussed on

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
