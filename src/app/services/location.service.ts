import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Matching the interface to the JSON structure
export interface Location {
  date: string;
  venue: string;
  address: string;
  start: string;
  end: string;
  details: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private url = 'assets/locations.json';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.url);
  }
}
