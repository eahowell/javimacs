import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject, shareReplay, catchError, tap } from 'rxjs';

// Centralized interface definition that both service and components can use
export interface Location {
  id: string;
  date: string;
  venue: string;
  address: string;
  start: string;
  end: string;
  details: string;
}

@Injectable({
  providedIn: 'root' // Makes this service available application-wide
})
export class LocationService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'assets/locations.json';

  // BehaviorSubject allows us to cache data and share it between components
  private locationsSubject = new BehaviorSubject<Location[]>([]);

  // Public observable that components can subscribe to
  public locations$ = this.locationsSubject.asObservable();

  // Cached observable to prevent multiple HTTP requests
  private locationsCache$: Observable<Location[]> | null = null;

  /**
   * Get locations with intelligent caching
   * First call makes HTTP request, subsequent calls use cached data
   */
  getLocations(): Observable<Location[]> {
    // If we don't have cached data, create the HTTP request stream
    if (!this.locationsCache$) {
      console.log('🔄 LocationService: Creating new HTTP request stream');

      this.locationsCache$ = this.http.get<Location[]>(this.apiUrl).pipe(
        tap(locations => {
          console.log(`✅ LocationService: Successfully loaded ${locations.length} locations`);
          // Update our BehaviorSubject with the new data
          this.locationsSubject.next(locations);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ LocationService: Failed to load locations', error);
          // Update subject with empty array on error
          this.locationsSubject.next([]);
          // Return empty array to prevent stream from breaking
          return of([]);
        }),
        // shareReplay ensures multiple subscribers get the same cached result
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
      console.log('📦 LocationService: Using cached data');
    }

    return this.locationsCache$;
  }

  /**
   * Force refresh of location data (useful for refresh buttons)
   */
  refreshLocations(): Observable<Location[]> {
    console.log('🔄 LocationService: Force refreshing location data');
    this.locationsCache$ = null; // Clear cache
    return this.getLocations();
  }

  /**
   * Get current cached locations synchronously
   * Useful when you need the current value immediately
   */
  getCurrentLocations(): Location[] {
    return this.locationsSubject.value;
  }

  /**
   * Check if we have any location data loaded
   */
  hasLocations(): boolean {
    return this.getCurrentLocations().length > 0;
  }

  /**
   * Get a specific location by ID
   * Example of how services can provide additional business logic
   */
  getLocationById(id: string): Location | undefined {
    return this.getCurrentLocations().find(location => location.id === id);
  }

  /**
   * Get upcoming locations (in the future)
   * Example of business logic that belongs in the service
   */
  getUpcomingLocations(): Location[] {
    const today = new Date();
    return this.getCurrentLocations().filter(location => {
      const locationDate = new Date(location.date);
      return locationDate >= today;
    });
  }
}
