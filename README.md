# Javimacs

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## User Stories
# Venue and Event Admin - Gherkin User Stories

## Feature: Venue Management

### Scenario: View all venues
```gherkin
Given I am an authenticated admin user
When I navigate to the venues management page
Then I should see a list of all venues
And each venue should display name, address, city, state, zip
And each venue should show its active/inactive status
And each venue should show the created date
And the list should be sortable by name, city, and created date
```

### Scenario: Add a new venue
```gherkin
Given I am an authenticated admin user
And I am on the venues management page
When I click the "Add New Venue" button
Then I should see a venue creation form
And the form should have required fields: name, address, city, state, zip
And the form should have optional fields: contact phone, contact email, notes
And the venue should be set as active by default
When I fill in all required fields with valid data
And I click "Save Venue"
Then the venue should be created with a unique ID
And the venue should appear in the venues list
And I should see a success message "Venue created successfully"
And the created date should be set to the current date/time
```

### Scenario: Add venue with validation errors
```gherkin
Given I am an authenticated admin user
And I am on the venue creation form
When I try to save a venue without filling required fields
Then I should see validation error messages
And the form should highlight invalid fields
And the venue should not be saved
When I fill in "name" with text longer than 100 characters
Then I should see an error "Venue name must be 100 characters or less"
When I fill in "zip" with invalid format
Then I should see an error "Please enter a valid zip code"
```

### Scenario: Edit an existing venue
```gherkin
Given I am an authenticated admin user
And there are existing venues in the system
When I click the "Edit" button for a specific venue
Then I should see the venue edit form
And all current venue data should be pre-populated
When I modify the venue information
And I click "Update Venue"
Then the venue should be updated in the system
And I should see a success message "Venue updated successfully"
And the updated information should be displayed in the venues list
```

### Scenario: Deactivate a venue
```gherkin
Given I am an authenticated admin user
And there is an active venue in the system
When I click the "Deactivate" button for the venue
Then I should see a confirmation dialog "Are you sure you want to deactivate this venue?"
When I confirm the deactivation
Then the venue's isActive status should be set to false
And the venue should still appear in the list but marked as inactive
And I should see a success message "Venue deactivated successfully"
```

### Scenario: Reactivate a venue
```gherkin
Given I am an authenticated admin user
And there is an inactive venue in the system
When I click the "Activate" button for the venue
Then the venue's isActive status should be set to true
And the venue should be marked as active in the list
And I should see a success message "Venue activated successfully"
```

### Scenario: Delete a venue with no associated events
```gherkin
Given I am an authenticated admin user
And there is a venue with no associated events
When I click the "Delete" button for the venue
Then I should see a confirmation dialog "Are you sure you want to permanently delete this venue?"
When I confirm the deletion
Then the venue should be removed from the system
And the venue should no longer appear in the venues list
And I should see a success message "Venue deleted successfully"
```

### Scenario: Attempt to delete a venue with associated events
```gherkin
Given I am an authenticated admin user
And there is a venue with associated events
When I click the "Delete" button for the venue
Then I should see an error message "Cannot delete venue with associated events"
And the venue should remain in the system
And I should see a suggestion to "Deactivate the venue instead or remove associated events first"
```

### Scenario: Search venues
```gherkin
Given I am an authenticated admin user
And there are multiple venues in the system
When I enter "Tractor Supply" in the venue search field
Then I should see only venues that match the search term in name, address, or city
When I clear the search field
Then I should see all venues again
```

### Scenario: Filter venues by status
```gherkin
Given I am an authenticated admin user
And there are both active and inactive venues in the system
When I select the "Active Only" filter
Then I should see only venues where isActive is true
When I select the "Inactive Only" filter
Then I should see only venues where isActive is false
When I select "All Venues"
Then I should see all venues regardless of status
```

## Feature: Event Management

### Scenario: View all events
```gherkin
Given I am an authenticated admin user
When I navigate to the events management page
Then I should see a list of all events
And each event should display date, venue name, start time, end time
And each event should show its active/inactive status
And each event should show associated venue information
And the list should be sortable by date, venue, and status
```

### Scenario: Add a new event
```gherkin
Given I am an authenticated admin user
And there are active venues in the system
When I click the "Add New Event" button
Then I should see an event creation form
And the venue field should be a dropdown of active venues
And the form should have required fields: venue, date, start time, end time, details
And the form should have optional fields: expected attendance, special requirements
And the event should be set as active by default
When I fill in all required fields with valid data
And I click "Save Event"
Then the event should be created with a unique ID
And the event should appear in the events list
And I should see a success message "Event created successfully"
```

### Scenario: Add event with validation errors
```gherkin
Given I am an authenticated admin user
And I am on the event creation form
When I try to save an event without selecting a venue
Then I should see an error "Please select a venue"
When I select a date in the past
Then I should see an error "Event date cannot be in the past"
When I set the end time before the start time
Then I should see an error "End time must be after start time"
When I enter expected attendance as a negative number
Then I should see an error "Expected attendance must be a positive number"
```

### Scenario: Edit an existing event
```gherkin
Given I am an authenticated admin user
And there are existing events in the system
When I click the "Edit" button for a specific event
Then I should see the event edit form
And all current event data should be pre-populated
And the venue dropdown should show the current venue as selected
When I modify the event information
And I click "Update Event"
Then the event should be updated in the system
And I should see a success message "Event updated successfully"
```

### Scenario: Cancel an event
```gherkin
Given I am an authenticated admin user
And there is an active upcoming event
When I click the "Cancel" button for the event
Then I should see a confirmation dialog "Are you sure you want to cancel this event?"
When I confirm the cancellation
Then the event's isActive status should be set to false
And the event should be marked as cancelled in the list
And I should see a success message "Event cancelled successfully"
```

### Scenario: Delete a past event
```gherkin
Given I am an authenticated admin user
And there is a past event in the system
When I click the "Delete" button for the event
Then I should see a confirmation dialog "Are you sure you want to permanently delete this event?"
When I confirm the deletion
Then the event should be removed from the system
And I should see a success message "Event deleted successfully"
```

### Scenario: Filter events by status
```gherkin
Given I am an authenticated admin user
And there are events with different statuses
When I select the "Upcoming Events" filter
Then I should see only events with future dates and isActive true
When I select the "Past Events" filter
Then I should see only events with past dates
When I select the "Cancelled Events" filter
Then I should see only events where isActive is false
```

### Scenario: Filter events by venue
```gherkin
Given I am an authenticated admin user
And there are events at different venues
When I select a specific venue from the venue filter dropdown
Then I should see only events associated with that venue
When I select "All Venues"
Then I should see events from all venues
```

### Scenario: Filter events by date range
```gherkin
Given I am an authenticated admin user
And there are events on various dates
When I set a start date and end date in the date range filter
Then I should see only events that fall within that date range
When I clear the date range filter
Then I should see all events
```

## Feature: Combined Event and Venue Management

### Scenario: View events with venue details
```gherkin
Given I am an authenticated admin user
When I navigate to the "Events with Venues" page
Then I should see a combined view of events with full venue information
And each event should display venue name, address, contact info if available
And I should be able to sort by any venue or event field
And I should be able to filter by venue characteristics
```

### Scenario: Bulk operations on events
```gherkin
Given I am an authenticated admin user
And there are multiple events selected via checkboxes
When I click "Bulk Actions" dropdown
Then I should see options for "Cancel Selected", "Activate Selected", "Export Selected"
When I select "Cancel Selected"
Then I should see a confirmation dialog with the count of selected events
When I confirm the bulk action
Then all selected events should be cancelled
And I should see a success message "X events cancelled successfully"
```

### Scenario: View venue statistics
```gherkin
Given I am an authenticated admin user
When I navigate to the venue statistics page
Then I should see a summary of each venue including:
  - Total number of events hosted
  - Number of upcoming events
  - Number of past events
  - Average expected attendance
And the statistics should be sortable and filterable
```

### Scenario: Export data
```gherkin
Given I am an authenticated admin user
When I click the "Export" button on venues page
Then I should see export format options (CSV, Excel, PDF)
When I select CSV format
Then a CSV file should be downloaded with all venue data
And the file should include all visible columns based on current filters
```

### Scenario: Import venues from file
```gherkin
Given I am an authenticated admin user
And I have a properly formatted CSV file with venue data
When I click "Import Venues" button
Then I should see a file upload dialog
When I select my CSV file and click "Upload"
Then the system should validate the file format
And show a preview of venues to be imported
When I confirm the import
Then all valid venues should be added to the system
And the data should be persisted locally
And I should see a summary "X venues imported successfully, Y errors"
And any errors should be displayed with specific details
```

## Feature: Local Data Persistence

### Scenario: Auto-save form data
```gherkin
Given I am an authenticated admin user
And I am filling out a venue creation form
When I enter data in any field
Then the form data should be temporarily saved locally
And if I accidentally navigate away and return
Then my partially completed form data should be restored
And I should see a message "Form data restored from previous session"
```

### Scenario: Data backup and restore
```gherkin
Given I am an authenticated admin user
When I navigate to the data management section
Then I should see options to "Export All Data" and "Import Data"
When I click "Export All Data"
Then I should get a JSON file containing all venues and events
And the file should include metadata like export date and version
When I import the file on another session
Then all data should be restored accurately
And I should see a confirmation "Data imported successfully"
```

### Scenario: Handle data persistence errors
```gherkin
Given I am an authenticated admin user
And local storage is nearly full
When I try to save a new venue
Then I should see a warning "Storage space low - consider exporting old data"
And the save operation should still complete if possible
When local storage is completely full
Then I should see an error "Cannot save - please export and clear old data"
And I should be offered options to export current data
```

## Feature: Audit Trail and Change Tracking

### Scenario: Track venue modifications
```gherkin
Given I am an authenticated admin user
And there is an existing venue in the system
When I edit the venue and change the name from "Old Name" to "New Name"
And I save the changes
Then an audit record should be created with:
  - Action: "VENUE_UPDATED"
  - Changed fields: "name"
  - Old value: "Old Name"
  - New value: "New Name"
  - Timestamp: current date/time
  - User: current admin user
```

### Scenario: View audit history for a venue
```gherkin
Given I am an authenticated admin user
And a venue has been modified multiple times
When I click "View History" for the venue
Then I should see a chronological list of all changes
And each entry should show what changed, when, and who made the change
And I should be able to expand entries to see detailed field changes
```

### Scenario: Track event lifecycle
```gherkin
Given I am an authenticated admin user
When I create a new event
Then an audit record should be created: "EVENT_CREATED"
When I later cancel the event
Then an audit record should be created: "EVENT_CANCELLED"
When I delete the event
Then an audit record should be created: "EVENT_DELETED"
And all audit records should be preserved even after data deletion
```

### Scenario: Export audit trail
```gherkin
Given I am an authenticated admin user
When I navigate to the audit section
And I click "Export Audit Trail"
Then I should get a CSV file with all audit records
And the file should include columns: timestamp, action, entity_type, entity_id, user, details
And I should be able to filter the export by date range or entity type
```

### Scenario: View system activity dashboard
```gherkin
Given I am an authenticated admin user
When I navigate to the activity dashboard
Then I should see recent activity including:
  - Last 10 modifications made
  - Most frequently modified venues
  - Recent data exports/imports
  - System usage statistics
```

## Feature: Mobile Responsive Admin Interface

### Scenario: Navigate admin on mobile device
```gherkin
Given I am an authenticated admin user
And I am using a mobile device (screen width < 768px)
When I access the admin interface
Then the navigation should collapse into a hamburger menu
And all admin functions should be accessible via the mobile menu
And the layout should stack vertically for better mobile viewing
```

### Scenario: Create venue on mobile
```gherkin
Given I am an authenticated admin user on a mobile device
When I navigate to create a new venue
Then the form should display in a single column layout
And form fields should be appropriately sized for touch input
And the virtual keyboard should not obscure form fields
When I fill out the form and save
Then the operation should work exactly as on desktop
And I should see appropriate mobile-optimized success feedback
```

### Scenario: Manage events on tablet
```gherkin
Given I am an authenticated admin user on a tablet device
When I view the events list
Then the table should be horizontally scrollable
And essential columns (date, venue, status) should remain visible
And action buttons should be appropriately sized for touch
When I tap an event to edit
Then the edit form should utilize the available tablet screen space efficiently
```

### Scenario: Mobile-optimized data tables
```gherkin
Given I am an authenticated admin user on a mobile device
When I view the venues list
Then non-essential columns should be hidden on small screens
And I should be able to tap a venue to see full details in an expanded view
And sorting and filtering should work via mobile-friendly controls
And pagination should use large, touch-friendly buttons
```

### Scenario: Mobile form validation
```gherkin
Given I am an authenticated admin user on a mobile device
And I am filling out a venue form
When I make a validation error
Then error messages should be clearly visible without zooming
And the form should scroll to show the first error
And error styling should be touch-friendly and clearly visible
```

### Scenario: Offline capability awareness
```gherkin
Given I am an authenticated admin user on a mobile device
And I lose internet connectivity
When I try to perform admin actions
Then I should see a clear message "Working offline - changes will be saved locally"
And all local operations should continue to work
And when connectivity returns, I should see "Back online" confirmation
```

## Feature: Form Usability and User Experience

### Scenario: Smart form defaults
```gherkin
Given I am an authenticated admin user
When I create a new event
Then the date field should default to tomorrow
And the start time should default to "11:00 AM"
And the end time should default to "5:00 PM"
And the venue should remember the last selected venue for convenience
```

### Scenario: Form auto-completion
```gherkin
Given I am an authenticated admin user
And I have created venues in "Tallahassee, FL" before
When I start typing "Talla" in the city field
Then I should see "Tallahassee" as an auto-complete suggestion
When I select the suggestion
Then the state field should auto-populate to "FL"
```

### Scenario: Unsaved changes warning
```gherkin
Given I am an authenticated admin user
And I have modified a venue form but not saved
When I try to navigate away from the page
Then I should see a warning "You have unsaved changes. Are you sure you want to leave?"
When I choose to stay
Then I should remain on the form with my changes intact
When I choose to leave
Then I should navigate away and lose my changes
```

### Scenario: Form field dependencies
```gherkin
Given I am an authenticated admin user
And I am creating an event
When I select a venue from the dropdown
Then the address fields should auto-populate with venue information (read-only)
And any venue-specific notes should be displayed as helpful context
```

### Scenario: Bulk edit interface
```gherkin
Given I am an authenticated admin user
And I have selected multiple events via checkboxes
When I click "Bulk Edit"
Then I should see a form with only editable common fields
And fields should show "Mixed Values" when selected items have different values
When I change a field and save
Then only that field should be updated across all selected items
And individual validation should apply to each item
```

## Feature: Dashboard and Analytics

### Scenario: View admin dashboard
```gherkin
Given I am an authenticated admin user
When I navigate to the admin dashboard
Then I should see key metrics including:
  - Total number of venues (active/inactive)
  - Total number of events (upcoming/past/cancelled)
  - Next 5 upcoming events
  - Recently added venues
  - Events requiring attention (missing details, conflicts)
```

### Scenario: View event conflicts
```gherkin
Given I am an authenticated admin user
And there are overlapping events at the same venue
When I view the conflicts section on the dashboard
Then I should see a list of conflicting events
And each conflict should show the overlapping events with times
And I should have options to "Edit" or "View Details" for each conflict
```

## Feature: Data Validation and Business Rules

### Scenario: Prevent venue name duplicates
```gherkin
Given I am an authenticated admin user
And there is already a venue named "Tractor Supply" in "Tallahassee"
When I try to create a new venue with the same name and city
Then I should see an error "A venue with this name already exists in this city"
And the venue should not be created
```

### Scenario: Validate venue address format
```gherkin
Given I am an authenticated admin user
When I enter an address without a street number
Then I should see a warning "Address appears incomplete"
When I enter a zip code that doesn't match the state
Then I should see a warning "Zip code may not match the selected state"
```

### Scenario: Event scheduling constraints
```gherkin
Given I am an authenticated admin user
And there is already an event at "Tractor Supply" from 11:00 AM to 5:00 PM on May 27, 2025
When I try to create another event at the same venue with overlapping times
Then I should see an error "This venue is already booked during the selected time"
And I should see the conflicting event details
And the event should not be created
```
