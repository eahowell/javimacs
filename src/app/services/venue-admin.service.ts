// src/app/services/venue-admin.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, shareReplay } from 'rxjs';
import { VenueService } from './venue.service';
import { Venue } from '../interfaces/venue.interface';

@Injectable({
  providedIn: 'root',
})
export class VenueAdminService {
  private venueService = inject(VenueService);
  constructor() {}

  getAllVenues(): Observable<Venue[]>{
    return this.venueService.getVenues();
  }
}
