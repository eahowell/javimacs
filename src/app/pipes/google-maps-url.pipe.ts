import { Pipe, PipeTransform } from '@angular/core';
import { EventWithVenue } from '../services/event-management.service';

/**
 * Transforms EventWithVenue object into a Google Maps URL
 *
 * Example usage in template:
 * <a [href]="eventWithVenue | googleMapsUrl" target="_blank">Get Directions</a>
 *
 * Output: "https://www.google.com/maps/search/?api=1&query=venue+name,+2056+Vineland+Dr,+Tallahassee,+FL+32308"
 */
@Pipe({
  name: 'googleMapsUrl',
  standalone: true,
  pure: true,
})
export class GoogleMapsUrlPipe implements PipeTransform {
  /**
   * Transforms an EventWithVenue object into a Google Maps search URL
   *
   * @param eventWithVenue - The event with venue object containing address fields
   * @returns Google Maps URL string, or empty string if event is invalid
   */
  transform(eventWithVenue: EventWithVenue | null | undefined): string {
    if (!eventWithVenue || !eventWithVenue.venue) {
      return '';
    }
    const fullAddress = this.buildFullAddress(eventWithVenue);
    // If we don't have any address information, return empty string
    if (!fullAddress) {
      return '';
    }
    const encodedAddress = encodeURIComponent(fullAddress);

    // Build the Google Maps URL using the Google Maps Search API
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  }

  /**
   * Helper method to build the full address string
   * This is similar to our AddressFormatPipe but optimized for Google Maps
   */
  private buildFullAddress(eventWithVenue: EventWithVenue): string {
    const addressParts: string[] = [];
    const venue = eventWithVenue.venue;

    if (venue.name?.trim()) {
      addressParts.push(venue.name.trim());
    }
    if (venue.address?.trim()) {
      addressParts.push(venue.address.trim());
    }
    if (venue.city?.trim()) {
      addressParts.push(venue.city.trim());
    }
    if (venue.state?.trim()) {
      addressParts.push(venue.state.trim());
    }
    if (venue.zip?.trim()) {
      addressParts.push(venue.zip.trim());
    }
    return addressParts.length > 0 ? addressParts.join(', ') : '';
  }
}
