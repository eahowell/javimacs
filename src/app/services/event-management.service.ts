// src/app/services/event-management.service.ts

import { Injectable, inject } from '@angular/core';
import {
  Observable,
  combineLatest,
  map,
  shareReplay,
  BehaviorSubject,
} from 'rxjs';
import { EventService } from './event.service';
import { VenueService } from './venue.service';
import { Event } from '../interfaces/event.interface';
import { Venue } from '../interfaces/venue.interface';
export interface EventWithVenue {
  id: string;
  venueId: string;
  date: Date;
  startTime: string;
  endTime: string;
  details: string;
  isActive: boolean;
  createdDate: Date;
  expectedAttendance?: number;
  specialRequirements?: string;
  venue: Venue; // Complete venue details embedded
}

/**
 * Backward compatibility interface that matches your current locations.json structure
 * This helps transition components from the old system to the new one
 */
export interface LocationCompat {
  id: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  start: string;
  end: string;
  details: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventManagementService {
  // Inject dependencies
  private eventService = inject(EventService);
  private venueService = inject(VenueService);
  // Cache for combined data to prevent excessive recalculation
  private combinedDataCache$: Observable<EventWithVenue[]> | null = null;
  private combinedDataSubject = new BehaviorSubject<EventWithVenue[]>([]);
  public combinedData$ = this.combinedDataSubject.asObservable();

  constructor() {
    // console.log(
    //   '🎯 EventManagementService: Initializing event management coordination'
    // );
    this.initializeCombinedData();
  }
  /**
   * Core method that combines events with their venue information
   * This is the heart of the service - it takes separate event and venue data
   * and creates a unified view that's much easier for components to work with
   */
  private initializeCombinedData(): void {
    // combineLatest waits for both services to emit data, then combines them
    this.combinedDataCache$ = combineLatest([
      this.eventService.getEvents(),
      this.venueService.getVenues(),
    ]).pipe(
      map(([events, venues]) => {
        // console.log(
        //   `🔄 EventManagementService: Combining ${events.length} events with ${venues.length} venues`
        // );

        // Create a lookup map for faster venue retrieval
        const venueMap = new Map<string, Venue>();
        venues.forEach((venue) => venueMap.set(venue.id, venue));

        // Transform each event by adding its venue information
        const combined = events
          .map((event) => {
            const venue = venueMap.get(event.venueId);

            if (!venue) {
              console.warn(
                `⚠️ EventManagementService: No venue found for event ${event.id} (venueId: ${event.venueId})`
              );
              return null; // Skip events with missing venues
            }

            // Create the combined object
            const eventWithVenue: EventWithVenue = {
              ...event, // Spread all event properties
              venue, // Add the complete venue object
            };
            return eventWithVenue;
          })
          .filter((item) => item !== null) as EventWithVenue[]; // Remove any null entries

        // console.log(
        //   `✅ EventManagementService: Successfully combined ${combined.length} events with venue data`
        // );

        // Update our BehaviorSubject so components can subscribe to changes
        this.combinedDataSubject.next(combined);
        return combined;
      }),
      // Ensures multiple subscribers get the same cached result
      shareReplay({ bufferSize: 1, refCount: false })
    );

    // Execute the combination immediately to populate our cache
    this.combinedDataCache$.subscribe();
  }

  /**
   * Get all events with their venue information
   * This is your primary method for getting event data in components
   */
  getEventsWithVenues(): Observable<EventWithVenue[]> {
    if (!this.combinedDataCache$) {
      this.initializeCombinedData();
    }
    return this.combinedDataCache$!;
  }
  // Get upcoming events only (future dates)
  getUpcomingEventsWithVenues(): Observable<EventWithVenue[]> {
    return this.getEventsWithVenues().pipe(
      map((events) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Start of today

        return events
          .filter((event) => event.isActive && event.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime());
      })
    );
  }
  /**
   * Get events for a specific venue
   * Useful for venue-specific displays or analytics
   */
  getEventsForVenue(venueId: string): Observable<EventWithVenue[]> {
    return this.getEventsWithVenues().pipe(
      map((events) => events.filter((event) => event.venueId === venueId))
    );
  }
  getEventsInDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<EventWithVenue[]> {
    return this.getEventsWithVenues().pipe(
      map((events) =>
        events
          .filter((event) => event.date >= startDate && event.date <= endDate)
          .sort((a, b) => a.date.getTime() - b.date.getTime())
      )
    );
  }
  getNextEvent(): Observable<EventWithVenue | null> {
    return this.getUpcomingEventsWithVenues().pipe(
      map((events) => (events.length > 0 ? events[0] : null))
    );
  }
  getTodaysEvents(): Observable<EventWithVenue[]> {
    return this.getEventsWithVenues().pipe(
      map((events) => {
        const today = new Date();
        return events.filter(
          (event) =>
            event.isActive && event.date.toDateString() === today.toDateString()
        );
      })
    );
  }
  searchEvents(query: string): Observable<EventWithVenue[]> {
    return this.getEventsWithVenues().pipe(
      map((events) => {
        const lowercaseQuery = query.toLowerCase();
        return events.filter(
          (event) =>
            event.venue.name.toLowerCase().includes(lowercaseQuery) ||
            event.venue.address.toLowerCase().includes(lowercaseQuery) ||
            event.venue.city.toLowerCase().includes(lowercaseQuery) ||
            event.details.toLowerCase().includes(lowercaseQuery)
        );
      })
    );
  }
  /**
   * Backward compatibility method for existing LocationsComponent
   * This transforms the new event/venue structure back to the old locations format
   * Use this during your transition period, then remove once you've updated all components
   */
  getLocationsCompat(): Observable<LocationCompat[]> {
    return this.getUpcomingEventsWithVenues().pipe(
      map((events) =>
        events.map((event) => ({
          id: event.id,
          date: event.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD string
          venue: event.venue.name,
          address: event.venue.address,
          city: event.venue.city,
          state: event.venue.state,
          zip: event.venue.zip,
          start: event.startTime,
          end: event.endTime,
          details: event.details,
        }))
      )
    );
  }
  refreshAllData(): Observable<EventWithVenue[]> {
    // console.log(
    //   '🔄 EventManagementService: Force refreshing all event and venue data'
    // );

    // Clear our cache to force fresh data
    this.combinedDataCache$ = null;

    // Trigger refresh on both underlying services
    this.eventService.refreshEvents().subscribe();
    this.venueService.refreshVenues().subscribe();

    // Reinitialize with fresh data
    this.initializeCombinedData();

    return this.getEventsWithVenues();
  }

  getCurrentEventsWithVenues(): EventWithVenue[] {
    return this.combinedDataSubject.value;
  }

  hasEvents(): boolean {
    return this.getCurrentEventsWithVenues().length > 0;
  }

  getEventWithVenueById(eventId: string): EventWithVenue | null {
    return (
      this.getCurrentEventsWithVenues().find((event) => event.id === eventId) ||
      null
    );
  }

  getVenueStatistics(): Observable<
    {
      venueId: string;
      venueName: string;
      eventCount: number;
      upcomingEvents: number;
    }[]
  > {
    return this.getEventsWithVenues().pipe(
      map((events) => {
        const now = new Date();
        const venueStats = new Map<
          string,
          { venueName: string; total: number; upcoming: number }
        >();

        events.forEach((event) => {
          const existing = venueStats.get(event.venueId) || {
            venueName: event.venue.name,
            total: 0,
            upcoming: 0,
          };

          existing.total++;
          if (event.date >= now && event.isActive) {
            existing.upcoming++;
          }

          venueStats.set(event.venueId, existing);
        });

        return Array.from(venueStats.entries()).map(([venueId, stats]) => ({
          venueId,
          venueName: stats.venueName,
          eventCount: stats.total,
          upcomingEvents: stats.upcoming,
        }));
      })
    );
  }
}
