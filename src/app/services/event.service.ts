// src/app/services/event.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Observable,
  of,
  BehaviorSubject,
  shareReplay,
  catchError,
  tap,
  map,
} from 'rxjs';
import { Event } from '../interfaces/event.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'assets/events.json';
  // Cache data to share between components
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  public events$ = this.eventsSubject.asObservable();
  // Prevents multiple HTTP requests
  private eventsCache$: Observable<Event[]> | null = null;

  // Transform raw JSON data to proper Event objects with Date objects
  private transformEventData(rawData: any[]): Event[] {
    return rawData.map((item) => {
      // Create a proper Date object from the ISO string
      const eventDate = new Date(item.date);
      const createdDate = new Date(item.createdDate);

      // Validate the dates to ensure they're valid
      if (isNaN(eventDate.getTime())) {
        console.warn(
          `⚠️ EventService: Invalid date for event ${item.id}: ${item.date}`
        );
      }

      if (isNaN(createdDate.getTime())) {
        console.warn(
          `⚠️ EventService: Invalid created date for event ${item.id}: ${item.createdDate}`
        );
      }

      return {
        ...item,
        date: eventDate,
        createdDate: createdDate,
        isActive: Boolean(item.isActive), // Ensure boolean type
        // Parse optional numeric fields
        expectedAttendance: item.expectedAttendance
          ? Number(item.expectedAttendance)
          : undefined,
      };
    });
  }
  // First call makes HTTP request, subsequent calls use cached data
  getEvents(): Observable<Event[]> {
    if (!this.eventsCache$) {
      console.log('📅 EventService: Creating new HTTP request stream');

      this.eventsCache$ = this.http.get<any[]>(this.apiUrl).pipe(
        tap((rawData) => {
          console.log(
            `📥 EventService: Received ${rawData.length} raw event records`
          );
        }),
        map((rawData) => this.transformEventData(rawData)),
        tap((transformedData) => {
          console.log(
            `✅ EventService: Successfully transformed ${transformedData.length} events`
          );
          this.eventsSubject.next(transformedData);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ EventService: Failed to load events', error);
          this.eventsSubject.next([]);
          return of([]);
        }),
        // Ensures multiple subscribers get the same cached result
        shareReplay({ bufferSize: 1, refCount: false })
      );
    } else {
      console.log('📅 EventService: Using cached event data');
    }
    return this.eventsCache$;
  }
  refreshEvents(): Observable<Event[]> {
    console.log('🔄 EventService: Force refreshing event data');
    this.eventsCache$ = null;
    return this.getEvents();
  }

  getCurrentEvents(): Event[] {
    return this.eventsSubject.value;
  }

  hasEvents(): boolean {
    return this.getCurrentEvents().length > 0;
  }

  getEventById(id: string): Event | undefined {
    return this.getCurrentEvents().find((event) => event.id === id);
  }

  getActiveEvents(): Event[] {
    return this.getCurrentEvents().filter((event) => event.isActive);
  }
  // Get upcoming events (future dates only)
  getUpcomingEvents(): Event[] {
    const now = new Date();
    // Set to start of today to include events happening today
    now.setHours(0, 0, 0, 0);

    return this.getCurrentEvents()
      .filter((event) => {
        return event.isActive && event.date >= now;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort by date ascending
  }

  getPastEvents(): Event[] {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today

    return this.getCurrentEvents()
      .filter((event) => {
        return event.date < now;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending (most recent first)
  }

  getEventsByVenueId(venueId: string): Event[] {
    return this.getCurrentEvents().filter((event) => event.venueId === venueId);
  }

  getEventsByDateRange(startDate: Date, endDate: Date): Event[] {
    return this.getCurrentEvents()
      .filter((event) => {
        return event.date >= startDate && event.date <= endDate;
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  //  Get events for a specific month/year; Useful for calendar views
  getEventsForMonth(month: number, year: number): Event[] {
    return this.getCurrentEvents().filter((event) => {
      return (
        event.date.getMonth() === month && event.date.getFullYear() === year
      );
    });
  }

  // Get the next upcoming event; Useful for "next event" displays
  getNextEvent(): Event | undefined {
    const upcomingEvents = this.getUpcomingEvents();
    return upcomingEvents.length > 0 ? upcomingEvents[0] : undefined;
  }

  hasEventsToday(): boolean {
    const today = new Date();
    return this.getCurrentEvents().some((event) => {
      return (
        event.isActive && event.date.toDateString() === today.toDateString()
      );
    });
  }
  getTodaysEvents(): Event[] {
    const today = new Date();
    return this.getCurrentEvents().filter((event) => {
      return (
        event.isActive && event.date.toDateString() === today.toDateString()
      );
    });
  }
}
