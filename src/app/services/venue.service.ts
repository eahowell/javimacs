// src/app/services/venue.service.ts

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  shareReplay,
  tap,
} from 'rxjs';
import { Venue } from '../interfaces/venue.interface';

@Injectable({
  providedIn: 'root',
})
export class VenueService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'assets/venues.json';

  // Cache data to share between components
  private venuesSubject = new BehaviorSubject<Venue[]>([]);

  public venues$ = this.venuesSubject.asObservable();
  // Prevents multiple HTTP requests
  private venuesCache$: Observable<Venue[]> | null = null;

  // Transform raw JSON data to proper Venue objects with Date objects
  private transformVenueData(rawData: any[]): Venue[] {
    return rawData.map((item) => ({
      ...item,
      // Convert string dates to proper Date objects
      createdDate: new Date(item.createdDate),
      isActive: Boolean(item.isActive),
    }));
  }

  // First call makes HTTP request, subsequent calls use cached data
  getVenues(): Observable<Venue[]> {
    if (!this.venuesCache$) {

      this.venuesCache$ = this.http.get<any[]>(this.apiUrl).pipe(
        // tap((rawData) => {
        //   console.log(
        //     `📥 VenueService: Received ${rawData.length} raw venue records`
        //   );
        // }),
        map((rawData) => this.transformVenueData(rawData)),
        tap((transformedData) => {
          // console.log(
          //   `✅ VenueService: Successfully transformed ${transformedData.length} venues`
          // );
          // Update our BehaviorSubject with the transformed data
          this.venuesSubject.next(transformedData);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ VenueService: Failed to load venues', error);
          this.venuesSubject.next([]);
          return of([]);
        }),
        // Ensures multiple subscribers get the same cached result
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
    }

    return this.venuesCache$;
  }
  refreshVenues(): Observable<Venue[]> {
    this.venuesCache$ = null;
    return this.getVenues();
  }
  getCurrentVenues(): Venue[] {
    return this.venuesSubject.value;
  }
  hasVenues(): boolean {
    return this.getCurrentVenues().length > 0;
  }
  getVenueById(id: string): Venue | null {
    const venues = this.getCurrentVenues();
    return venues.find((venue) => venue.id === id) || null;
  }
  getActiveVenues(): Venue[] {
    return this.getCurrentVenues().filter((venue) => venue.isActive);
  }
  getInactiveVenues(): Venue[] {
    return this.getCurrentVenues().filter((venue) => !venue.isActive);
  }
  // Search venues by name or address
  searchVenues(query: string): Venue[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getCurrentVenues().filter(
      (venue) =>
        venue.name.toLowerCase().includes(lowercaseQuery) ||
        venue.address.toLowerCase().includes(lowercaseQuery) ||
        venue.city.toLowerCase().includes(lowercaseQuery)
    );
  }
  constructor() { };
}
