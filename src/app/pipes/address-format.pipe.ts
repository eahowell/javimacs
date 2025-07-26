import { Pipe, PipeTransform } from '@angular/core';
import { EventWithVenue } from '../services/event-management.service';

/**
 * Transforms EventWithVenue object into a formatted address string
 *
 * Example usage in template:
 * {{ eventWithVenue | addressFormat }}
 *
 * Output: "2056 Vineland Dr, Tallahassee, FL 32308"
 */
@Pipe({
  name: 'addressFormat',
  standalone: true,
  pure: true,
})
export class AddressFormatPipe implements PipeTransform {
  /**
   * Transforms an EventWithVenue object into a formatted address string
   *
   * @param eventWithVenue - The event with venue object containing address fields
   * @returns Formatted address string, or empty string if eventWithVenue is null/undefined
   */
  transform(eventWithVenue: EventWithVenue | null | undefined): string {
    if (!eventWithVenue || !eventWithVenue.venue) {
      return '';
    }

    const venue = eventWithVenue.venue;
    const addressParts: string[] = [];

    if (venue.address?.trim()) {
      addressParts.push(venue.address.trim());
    }
    if (venue.city?.trim()) {
      addressParts.push(venue.city.trim());
    }

    const stateZip = this.formatStateZip(venue.state, venue.zip);
    if (stateZip) {
      addressParts.push(stateZip);
    }

    return addressParts.join(', ');
  }

  private formatStateZip(
    state: string | undefined,
    zip: string | undefined
  ): string {
    const trimmedState = state?.trim();
    const trimmedZip = zip?.trim();

    if (trimmedState && trimmedZip) {
      return `${trimmedState} ${trimmedZip}`;
    } else if (trimmedState) {
      return trimmedState;
    } else if (trimmedZip) {
      return trimmedZip;
    }

    return '';
  }
}
