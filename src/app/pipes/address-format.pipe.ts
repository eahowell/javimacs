import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '../services/location.service';

/**
 * Transforms location object into a formatted address string
 *
 * Example usage in template:
 * {{ location | addressFormat }}
 *
 * Output: "2056 Vineland Dr, Tallahassee, FL 32308"
 */
@Pipe({
  name: 'addressFormat',
  standalone: true,
  pure: true
})
export class AddressFormatPipe implements PipeTransform {

  /**
   * Transforms a Location object into a formatted address string
   *
   * @param location - The location object containing address fields
   * @returns Formatted address string, or empty string if location is null/undefined
   */
  transform(location: Location | null | undefined): string {
    if (!location) {
      return '';
    }

    const addressParts: string[] = [];

    if (location.address?.trim()) {
      addressParts.push(location.address.trim());
    }
    if (location.city?.trim()) {
      addressParts.push(location.city.trim());
    }

    const stateZip = this.formatStateZip(location.state, location.zip);
    if (stateZip) {
      addressParts.push(stateZip);
    }

    return addressParts.join(', ');
  }

  private formatStateZip(state: string | undefined, zip: string | undefined): string {
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
