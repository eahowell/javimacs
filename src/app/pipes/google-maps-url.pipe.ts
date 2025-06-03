import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '../services/location.service';

/**
 * Transforms location object into a Google Maps URL
 *
 * Example usage in template:
 * <a [href]="location | googleMapsUrl" target="_blank">Get Directions</a>
 *
 * Output: "https://www.google.com/maps/search/?api=1&query=2056+Vineland+Dr,+Tallahassee,+FL+32308"
 */
@Pipe({
  name: 'googleMapsUrl',
  standalone: true,
  pure: true
})
export class GoogleMapsUrlPipe implements PipeTransform {

  /**
   * Transforms a Location object into a Google Maps search URL
   *
   * @param location - The location object containing address fields
   * @returns Google Maps URL string, or empty string if location is invalid
   */
  transform(location: Location | null | undefined): string {
    if (!location) {
      return '';
    }
    const fullAddress = this.buildFullAddress(location);
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
  private buildFullAddress(location: Location): string {
    const addressParts: string[] = [];
    if (location.venue?.trim()) {
      addressParts.push(location.venue.trim());
    }
    if (location.address?.trim()) {
      addressParts.push(location.address.trim());
    }
    if (location.city?.trim()) {
      addressParts.push(location.city.trim());
    }
    if (location.state?.trim()) {
      addressParts.push(location.state.trim());
    }
    if (location.zip?.trim()) {
      addressParts.push(location.zip.trim());
    }
    return addressParts.length > 0 ? addressParts.join(', ') : '';
  }
}
