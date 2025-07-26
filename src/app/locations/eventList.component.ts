import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, of, tap } from 'rxjs';
import { AddressFormatPipe } from '../pipes/address-format.pipe';
import { GoogleMapsUrlPipe } from '../pipes/google-maps-url.pipe';
import {
  EventManagementService
} from '../services/event-management.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    AddressFormatPipe,
    GoogleMapsUrlPipe,
    DatePipe,
  ],
  templateUrl: './eventList.component.html',
  styleUrls: ['./eventList.component.scss'],
})
export class EventListComponent {
  // Inject the new event management service
  private eventManagementService = inject(EventManagementService);

  /**
   * Get upcoming events with venue information
   * This replaces the old HTTP call to locations.json
   * The service handles all the complexity of joining event and venue data
   */
  upcomingEvents = toSignal(
    this.eventManagementService.getUpcomingEventsWithVenues().pipe(
      tap((events) => {
        // console.log(
        //   '✅ LocationsComponent: Received upcoming events with venues'
        // );
        // console.log(`📍 Found ${events.length} upcoming events`);

        // Log event details for debugging
        // events.forEach((event) => {
        //   console.log(`📅 ${event.date.toDateString()} at ${event.venue.name}`);
        // });
      }),
      catchError((error) => {
        console.error('❌ LocationsComponent: Failed to load events', error);
        return of([]); // Return empty array on error
      })
    ),
    {
      initialValue: [], // Start with empty array while loading
    }
  );

  /**
   * Manual refresh method
   * This demonstrates how components can trigger data refresh when needed
   */
  refreshEvents(): void {
    // console.log('🔄 LocationsComponent: Manually refreshing event data');
    this.eventManagementService.refreshAllData().subscribe();
  }
}
