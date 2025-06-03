import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { catchError, of, tap } from 'rxjs';

// Interface matching the structure of the JSON file
export type Location = {
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
};

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent {
  http = inject(HttpClient);
   // Added detailed logging to help debug what's happening
  locations = toSignal(
    this.http.get<Location[]>('assets/locations.json').pipe(
      tap(data => {
        console.log('✅ Successfully loaded locations data');
        console.log(`📍 Found ${data.length} locations`);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ HTTP Request Failed!');
        console.error('🔍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message,
          fullError: error
        });

        // Provide specific guidance based on the error type
        if (error.status === 404) {
          console.error('📁 File not found! Check if assets/locations.json exists and is properly configured in angular.json');
          console.error('🔧 Try accessing http://localhost:4200/assets/locations.json directly in your browser');
        } else if (error.status === 0) {
          console.error('🌐 Network error! This might be a CORS issue or the dev server might not be serving the file correctly');
        } else {
          console.error(`💥 Server returned ${error.status}: ${error.statusText}`);
        }

        // Return empty array to prevent further errors
        return of([]);
      })
    ),
    {
      initialValue: [], // Start with empty array while loading
    }
  );

}
